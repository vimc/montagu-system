package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
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
    fun `can get estimated deaths for responsibility`()
    {
        val fakeEstimates: Map<Short, List<DisAggregatedBurdenEstimate>> =
                mapOf(1.toShort() to listOf(DisAggregatedBurdenEstimate(2000, 1, 100F, BurdenEstimateGrouping.AGE)))

        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenOutcomeIds("deaths") } doReturn listOf(1.toShort(), 2)
            on { getEstimatesForResponsibility(any(), any(),any()) } doReturn fakeEstimates
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        val result = sut.getEstimatedDeathsForResponsibility(groupId, touchstoneVersionId, scenarioId)
        assertThat(result).containsAllEntriesOf(fakeEstimates)
        verify(repo).getBurdenOutcomeIds("deaths")
    }

}