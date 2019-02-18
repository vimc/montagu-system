package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.mockito.Mockito
import org.vaccineimpact.api.app.errors.*
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.models.BurdenEstimateOutcome
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.burdenestimates.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant

class BurdenEstimateLogicTests : MontaguTests()
{
    private val defaultEstimateSet = BurdenEstimateSet(
            1, Instant.now(), "test.user",
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"),
            BurdenEstimateSetStatus.EMPTY,
            emptyList()
    )

    private val disease = "disease-1"
    private val responsibilityId = 1
    private val setId = 1
    private val groupId = "group-1"
    private val touchstoneVersionId = "touchstone-1"
    private val scenarioId = "scenario-1"

    private fun mockWriter(): BurdenEstimateWriter
    {
        return mock {
            on { addEstimatesToSet(any(), any(), any()) } doAnswer { args ->
                // Force evaluation of sequence
                args.getArgument<Sequence<BurdenEstimateWithRunId>>(1).toList()
                Unit
            }
        }
    }

    private fun mockEstimatesRepository(mockEstimateWriter: BurdenEstimateWriter = mockWriter(),
                                        existingBurdenEstimateSet: BurdenEstimateSet = defaultEstimateSet
    ): BurdenEstimateRepository
    {
        return mock {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn existingBurdenEstimateSet
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
            on { getEstimateWriter(any()) } doReturn mockEstimateWriter
        }
    }

    private val fakeExpectations = Expectations(1, "desc", 2000..2001, 1..2, CohortRestriction(),
            listOf(Country("AFG", "")),
            listOf())

    private fun mockExpectationsRepository(): ExpectationsRepository = mock {
        on { getExpectationsForResponsibility(responsibilityId) } doReturn ExpectationMapping(fakeExpectations, listOf(), disease)
    }

    private fun mockGroupRepository(): ModellingGroupRepository = mock {
        on { getModellingGroup(groupId) } doReturn ModellingGroup(groupId, "description")
    }

    private val validData = sequenceOf(
            BurdenEstimateWithRunId("yf", null, 2000, 1, "AFG", "Afghanistan", 1000F, mapOf(
                    "deaths" to 10F,
                    "cases" to 100F
            )),
            BurdenEstimateWithRunId("yf", null, 2001, 1, "AFG", "Afghanistan", 1000F, mapOf(
                    "deaths" to 10F,
                    "cases" to 100F
            )),
            BurdenEstimateWithRunId("yf", null, 2000, 2, "AFG", "Afghanistan", 1000F, mapOf(
                    "deaths" to 10F,
                    "cases" to 100F
            )),
            BurdenEstimateWithRunId("yf", null, 2001, 2, "AFG", "Afghanistan", 1000F, mapOf(
                    "deaths" to 10F,
                    "cases" to 100F
            )))

    @Test
    fun `cannot upload data with multiple diseases`()
    {
        val data = sequenceOf(
                BurdenEstimateWithRunId("yf", null, 2000, 1, "AFG", "Afghanistan", 1000F, mapOf(
                        "deaths" to 10F,
                        "cases" to 100F
                )),
                BurdenEstimateWithRunId("menA", null, 2001, 2, "AFG", "Afghanistan", 2000F, mapOf(
                        "deaths" to 20F,
                        "dalys" to 73.6F
                )))
        val estimateWriter = mockWriter()
        val estimatesRepo = mockEstimatesRepository(estimateWriter)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), estimatesRepo, mockExpectationsRepository())
        Assertions.assertThatThrownBy {
            sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, data)
        }.isInstanceOf(InconsistentDataError::class.java)
                .hasMessageContaining("disease")
    }

    @Test
    fun `can populate burden estimate set`()
    {
        val writer = mockWriter()
        val repo = mockEstimatesRepository(writer)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData)

        verify(writer).addEstimatesToSet(eq(setId), any(), eq(disease))
    }

    @Test
    fun `set is marked as partial`()
    {
        val repo = mockEstimatesRepository()
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData)
        verify(repo).changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.PARTIAL)
    }

    @Test
    fun `gets estimate writer from repo`()
    {
        val repo = mockEstimatesRepository()
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData)
        verify(repo).getEstimateWriter(defaultEstimateSet)
    }

    @Test
    fun `gets burden estimate set data`()
    {
        val testOutcomeData = listOf(
                BurdenEstimateOutcome("YF", 1990, 20, "ABC", "ABC-Name",
                        "cohort_size", 100f),
                BurdenEstimateOutcome("YF", 1990, 20, "ABC", "ABC-Name",
                        "deaths", 1f),
                BurdenEstimateOutcome("YF", 1990, 20, "ABC", "ABC-Name",
                                        "dalys", 2f),

                BurdenEstimateOutcome("YF", 1991, 20, "ABC", "ABC-Name",
                "cohort_size", 101f),
                BurdenEstimateOutcome("YF", 1991, 20, "ABC", "ABC-Name",
                        "deaths", 3f),
                BurdenEstimateOutcome("YF", 1991, 20, "ABC", "ABC-Name",
                        "dalys", 4f),

                BurdenEstimateOutcome("YF", 1990, 21, "ABC", "ABC-Name",
                        "cohort_size", 102f),
                BurdenEstimateOutcome("YF", 1990, 21, "ABC", "ABC-Name",
                        "deaths", 5f),
                BurdenEstimateOutcome("YF", 1990, 21, "ABC", "ABC-Name",
                        "dalys", 6f),

                BurdenEstimateOutcome("YF", 1990, 20, "DEF", "DEF-Name",
                        "cohort_size", 103f),
                BurdenEstimateOutcome("YF", 1990, 20, "DEF", "DEF-Name",
                        "deaths", 7f),
                BurdenEstimateOutcome("YF", 1990, 20, "DEF", "DEF-Name",
                        "dalys", 8f)
        ).asSequence()
        val repo = mock<BurdenEstimateRepository> {
            on{ getBurdenEstimateOutcomesSequence(any(), any(), any(), any()) } doReturn testOutcomeData
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        val result = sut.getBurdenEstimateData(1, groupId,touchstoneVersionId, scenarioId)
        Assertions.assertThat(result.data.toList().count()).isEqualTo(4)
        var estimateObj = result.data.first()
        Assertions.assertThat(estimateObj.disease).isEqualTo("YF")
        Assertions.assertThat(estimateObj.year).isEqualTo(1990)
        Assertions.assertThat(estimateObj.age).isEqualTo(20)
        Assertions.assertThat(estimateObj.country).isEqualTo("ABC")
        Assertions.assertThat(estimateObj.countryName).isEqualTo("ABC-Name")
        Assertions.assertThat(estimateObj.cohortSize).isEqualTo(100f)
        Assertions.assertThat(estimateObj.outcomes["deaths"]).isEqualTo(1f)
        Assertions.assertThat(estimateObj.outcomes["dalys"]).isEqualTo(2f)

        estimateObj = result.data.elementAt(1)
        Assertions.assertThat(estimateObj.disease).isEqualTo("YF")
        Assertions.assertThat(estimateObj.year).isEqualTo(1991)
        Assertions.assertThat(estimateObj.age).isEqualTo(20)
        Assertions.assertThat(estimateObj.country).isEqualTo("ABC")
        Assertions.assertThat(estimateObj.countryName).isEqualTo("ABC-Name")
        Assertions.assertThat(estimateObj.cohortSize).isEqualTo(101f)
        Assertions.assertThat(estimateObj.outcomes["deaths"]).isEqualTo(3f)
        Assertions.assertThat(estimateObj.outcomes["dalys"]).isEqualTo(4f)

        estimateObj = result.data.elementAt(2)
        Assertions.assertThat(estimateObj.disease).isEqualTo("YF")
        Assertions.assertThat(estimateObj.year).isEqualTo(1990)
        Assertions.assertThat(estimateObj.age).isEqualTo(21)
        Assertions.assertThat(estimateObj.country).isEqualTo("ABC")
        Assertions.assertThat(estimateObj.countryName).isEqualTo("ABC-Name")
        Assertions.assertThat(estimateObj.cohortSize).isEqualTo(102f)
        Assertions.assertThat(estimateObj.outcomes["deaths"]).isEqualTo(5f)
        Assertions.assertThat(estimateObj.outcomes["dalys"]).isEqualTo(6f)

        estimateObj = result.data.elementAt(3)
        Assertions.assertThat(estimateObj.disease).isEqualTo("YF")
        Assertions.assertThat(estimateObj.year).isEqualTo(1990)
        Assertions.assertThat(estimateObj.age).isEqualTo(20)
        Assertions.assertThat(estimateObj.country).isEqualTo("DEF")
        Assertions.assertThat(estimateObj.countryName).isEqualTo("DEF-Name")
        Assertions.assertThat(estimateObj.cohortSize).isEqualTo(103f)
        Assertions.assertThat(estimateObj.outcomes["deaths"]).isEqualTo(7f)
        Assertions.assertThat(estimateObj.outcomes["dalys"]).isEqualTo(8f)
    }

    @Test
    fun `can populate a set if status is partial`()
    {
        val writer = mockWriter()
        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn defaultEstimateSet
                    .copy(status = BurdenEstimateSetStatus.PARTIAL)
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
            on { getEstimateWriter(any()) } doReturn writer
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData)
        verify(writer).addEstimatesToSet(eq(setId), any(), eq(disease))
    }

    @Test
    fun `cannot populate a set if status is complete`()
    {
        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn defaultEstimateSet
                    .copy(status = BurdenEstimateSetStatus.COMPLETE)
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        Assertions.assertThatThrownBy {
            sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData)
        }.isInstanceOf(InvalidOperationError::class.java)
                .hasMessageContaining("You must create a new set if you want to upload any new estimates.")

    }

    @Test
    fun `modelling-group id is checked before closing burden estimate set`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        val groupRepo = mockGroupRepository()
        val sut = RepositoriesBurdenEstimateLogic(groupRepo, repo, mockExpectationsRepository())
        sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        verify(groupRepo).getModellingGroup(groupId)
    }

    @Test
    fun `can close non-empty burden estimate set`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())
        sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        verify(repo).changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.COMPLETE)
    }

    @Test
    fun `cannot close empty burden estimate set`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(true)
        val repo = mockEstimatesRepository(writer)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(InvalidOperationError::class.java)
    }

    @Test
    fun `closing a burden estimate set with missing rows marks it as invalid`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        Mockito.`when`(repo.validateEstimates(any(), any())).doReturn(fakeExpectations.expectedRowHashMap())
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(MissingRowsError::class.java)
        verify(repo).changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.INVALID)
    }

    @Test
    fun `missing rows message contains all country names and one example row`()
    {
        val expectations = fakeExpectations.copy(ages = 10..15, countries = listOf(Country("AFG", ""), Country("AGO", ""),
                Country("NGA", "")))
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        Mockito.`when`(repo.validateEstimates(any(), any())).doReturn(expectations.expectedRowHashMap())
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(MissingRowsError::class.java)
                .hasMessage("""the following problems occurred:
Missing rows for AFG, AGO, NGA
For example:
AFG, age 10, year 2000""")
    }

    @Test
    fun `cannot close burden estimate set when responsibility lookup throws an error`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)

        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn defaultEstimateSet
                    .copy(status = BurdenEstimateSetStatus.PARTIAL)
            on { getResponsibilityInfo(groupId, touchstoneVersionId, scenarioId) } doThrow
                    UnknownObjectError(scenarioId, "responsibility")
            on { getEstimateWriter(defaultEstimateSet) } doReturn writer
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        Assertions.assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(UnknownObjectError::class.java).hasMessageContaining(scenarioId)
    }

    @Test
    fun `can get estimated deaths for responsibility`()
    {
        val fakeEstimates: Map<Short, List<BurdenEstimateDataPoint>> =
                mapOf(1.toShort() to listOf(BurdenEstimateDataPoint(2000, 1, 100F)))

        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenOutcomeIds("test-outcome") } doReturn listOf(1.toShort(), 2)
            on { getEstimates(any(), any(),any(), any()) } doReturn
                    BurdenEstimateDataSeries(BurdenEstimateGrouping.AGE, fakeEstimates)
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        val result = sut.getEstimates(1, groupId, touchstoneVersionId, scenarioId, "test-outcome")
        assertThat(result.data).containsAllEntriesOf(fakeEstimates)
        verify(repo).getBurdenOutcomeIds("test-outcome")
    }

}