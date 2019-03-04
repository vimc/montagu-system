package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import com.opencsv.CSVReader
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.mockito.Mockito
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.models.BurdenEstimateOutcome
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.burdenestimates.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.io.ByteArrayOutputStream
import java.io.StringReader
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
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), estimatesRepo, mockExpectationsRepository(), mock(), mock())
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
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData)

        verify(writer).addEstimatesToSet(eq(setId), any(), eq(disease))
    }

    @Test
    fun `set is marked as partial`()
    {
        val repo = mockEstimatesRepository()
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData)
        verify(repo).changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.PARTIAL)
    }

    @Test
    fun `gets estimate writer from repo`()
    {
        val repo = mockEstimatesRepository()
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

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
            on { getBurdenEstimateOutcomesSequence(any(), any(), any(), any()) } doReturn testOutcomeData
            on { getExpectedOutcomesForBurdenEstimateSet(any()) } doReturn listOf("dalys", "deaths")
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

        val result = sut.getBurdenEstimateData(1, groupId, touchstoneVersionId, scenarioId)

        //Test data objects
        Assertions.assertThat(result.data.toList().count()).isEqualTo(4)

        assertExpectedBurdenEstimate(result.data.first(), "YF", 1990, 20,
                "ABC", "ABC-Name", 100f,
                mapOf("deaths" to 1f, "dalys" to 2f))

        assertExpectedBurdenEstimate(result.data.elementAt(1), "YF", 1991, 20,
                "ABC", "ABC-Name", 101f,
                mapOf("deaths" to 3f, "dalys" to 4f))

        assertExpectedBurdenEstimate(result.data.elementAt(2), "YF", 1990, 21,
                "ABC", "ABC-Name", 102f,
                mapOf("deaths" to 5f, "dalys" to 6f))

        assertExpectedBurdenEstimate(result.data.elementAt(3), "YF", 1990, 20,
                "DEF", "DEF-Name", 103f,
                mapOf("deaths" to 7f, "dalys" to 8f))

    }

    @Test
    fun `can get burden estimate data with some missing outcome values`()
    {

        val testOutcomeData = listOf(
                BurdenEstimateOutcome("YF", 2000, 20, "ABC", "ABC-Name",
                        "cohort_size", 100f),
                BurdenEstimateOutcome("YF", 2000, 20, "ABC", "ABC-Name",
                        "cases", 40f),
                BurdenEstimateOutcome("YF", 2000, 20, "ABC", "ABC-Name",
                        "dalys", 25.5f),
                BurdenEstimateOutcome("YF", 2000, 20, "ABC", "ABC-Name",
                        "deaths", 2f),

                BurdenEstimateOutcome("YF", 2000, 20, "DEF", "DEF-Name",
                        "cohort_size", 50f),

                BurdenEstimateOutcome("YF", 2000, 21, "ABC", "ABC-Name",
                        "cohort_size", 200f),
                BurdenEstimateOutcome("YF", 2000, 21, "ABC", "ABC-Name",
                        "cases", 80f),
                BurdenEstimateOutcome("YF", 2000, 21, "ABC", "ABC-Name",
                        "deaths", 3f),

                BurdenEstimateOutcome("YF", 2001, 20, "ABC", "ABC-Name",
                        "cohort_size", 150f),
                BurdenEstimateOutcome("YF", 2001, 20, "ABC", "ABC-Name",
                        "deaths", 4f)

        ).asSequence()

        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateOutcomesSequence(any(), any(), any(), any()) } doReturn testOutcomeData
            on { getExpectedOutcomesForBurdenEstimateSet(any()) } doReturn listOf("cases", "cases_acute", "dalys", "deaths")
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

        val result = sut.getBurdenEstimateData(1, groupId, touchstoneVersionId, scenarioId)

        //Test data objects
        Assertions.assertThat(result.data.toList().count()).isEqualTo(4)

        assertExpectedBurdenEstimate(result.data.first(), "YF", 2000, 20,
                "ABC", "ABC-Name", 100f,
                mapOf("cases" to 40f, "dalys" to 25.5f, "deaths" to 2f))

        assertExpectedBurdenEstimate(result.data.elementAt(1), "YF", 2000, 20,
                "DEF", "DEF-Name", 50f,
                mapOf())

        assertExpectedBurdenEstimate(result.data.elementAt(2), "YF", 2000, 21,
                "ABC", "ABC-Name", 200f,
                mapOf("cases" to 80f, "deaths" to 3f))

        assertExpectedBurdenEstimate(result.data.elementAt(3), "YF", 2001, 20,
                "ABC", "ABC-Name", 150f,
                mapOf("deaths" to 4f))

        //Test serialization
        val stream = ByteArrayOutputStream()
        result.serialize(stream)
        val csv = StringReader(stream.toString())
                .use { CSVReader(it).readAll() }

        val firstRow = csv.first().toList() //headers

        Assertions.assertThat(firstRow.count()).isEqualTo(10)
        Assertions.assertThat(firstRow[0]).isEqualTo("disease")
        Assertions.assertThat(firstRow[1]).isEqualTo("year")
        Assertions.assertThat(firstRow[2]).isEqualTo("age")
        Assertions.assertThat(firstRow[3]).isEqualTo("country")
        Assertions.assertThat(firstRow[4]).isEqualTo("country_name")
        Assertions.assertThat(firstRow[5]).isEqualTo("cohort_size")
        Assertions.assertThat(firstRow[6]).isEqualTo("cases")
        Assertions.assertThat(firstRow[7]).isEqualTo("cases_acute")
        Assertions.assertThat(firstRow[8]).isEqualTo("dalys")
        Assertions.assertThat(firstRow[9]).isEqualTo("deaths")

        var dataRow = csv.drop(1).first().toList()

        Assertions.assertThat(dataRow.count()).isEqualTo(10)
        Assertions.assertThat(dataRow[0]).isEqualTo("YF")
        Assertions.assertThat(dataRow[1]).isEqualTo("2000")
        Assertions.assertThat(dataRow[2]).isEqualTo("20")
        Assertions.assertThat(dataRow[3]).isEqualTo("ABC")
        Assertions.assertThat(dataRow[4]).isEqualTo("ABC-Name")
        Assertions.assertThat(dataRow[5]).isEqualTo("100.0")
        Assertions.assertThat(dataRow[6]).isEqualTo("40.0")
        Assertions.assertThat(dataRow[7]).isEqualTo("<NA>")
        Assertions.assertThat(dataRow[8]).isEqualTo("25.5")
        Assertions.assertThat(dataRow[9]).isEqualTo("2.0")

        dataRow = csv.drop(2).first().toList()

        Assertions.assertThat(dataRow.count()).isEqualTo(10)
        Assertions.assertThat(dataRow[0]).isEqualTo("YF")
        Assertions.assertThat(dataRow[1]).isEqualTo("2000")
        Assertions.assertThat(dataRow[2]).isEqualTo("20")
        Assertions.assertThat(dataRow[3]).isEqualTo("DEF")
        Assertions.assertThat(dataRow[4]).isEqualTo("DEF-Name")
        Assertions.assertThat(dataRow[5]).isEqualTo("50.0")
        Assertions.assertThat(dataRow[6]).isEqualTo("<NA>")
        Assertions.assertThat(dataRow[7]).isEqualTo("<NA>")
        Assertions.assertThat(dataRow[8]).isEqualTo("<NA>")
        Assertions.assertThat(dataRow[9]).isEqualTo("<NA>")

        dataRow = csv.drop(3).first().toList()

        Assertions.assertThat(dataRow.count()).isEqualTo(10)
        Assertions.assertThat(dataRow[0]).isEqualTo("YF")
        Assertions.assertThat(dataRow[1]).isEqualTo("2000")
        Assertions.assertThat(dataRow[2]).isEqualTo("21")
        Assertions.assertThat(dataRow[3]).isEqualTo("ABC")
        Assertions.assertThat(dataRow[4]).isEqualTo("ABC-Name")
        Assertions.assertThat(dataRow[5]).isEqualTo("200.0")
        Assertions.assertThat(dataRow[6]).isEqualTo("80.0")
        Assertions.assertThat(dataRow[7]).isEqualTo("<NA>")
        Assertions.assertThat(dataRow[8]).isEqualTo("<NA>")
        Assertions.assertThat(dataRow[9]).isEqualTo("3.0")

        dataRow = csv.drop(4).first().toList()

        Assertions.assertThat(dataRow.count()).isEqualTo(10)
        Assertions.assertThat(dataRow[0]).isEqualTo("YF")
        Assertions.assertThat(dataRow[1]).isEqualTo("2001")
        Assertions.assertThat(dataRow[2]).isEqualTo("20")
        Assertions.assertThat(dataRow[3]).isEqualTo("ABC")
        Assertions.assertThat(dataRow[4]).isEqualTo("ABC-Name")
        Assertions.assertThat(dataRow[5]).isEqualTo("150.0")
        Assertions.assertThat(dataRow[6]).isEqualTo("<NA>")
        Assertions.assertThat(dataRow[7]).isEqualTo("<NA>")
        Assertions.assertThat(dataRow[8]).isEqualTo("<NA>")
        Assertions.assertThat(dataRow[9]).isEqualTo("4.0")

    }

    @Test
    fun `can get burden estimate data with missing cohort_size values`()
    {
        val testOutcomeData = listOf(
                BurdenEstimateOutcome("YF", 2000, 20, "ABC", "ABC-Name",
                        "cases", 40f),
                BurdenEstimateOutcome("YF", 2000, 20, "ABC", "ABC-Name",
                        "dalys", 25.5f),
                BurdenEstimateOutcome("YF", 2000, 20, "ABC", "ABC-Name",
                        "deaths", 2f),

                BurdenEstimateOutcome("YF", 2000, 20, "DEF", "DEF-Name",
                        "cases", 10f),
                BurdenEstimateOutcome("YF", 2000, 20, "DEF", "DEF-Name",
                        "dalys", 5.5f),
                BurdenEstimateOutcome("YF", 2000, 20, "DEF", "DEF-Name",
                        "deaths", 1f)


        ).asSequence()

        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateOutcomesSequence(any(), any(), any(), any()) } doReturn testOutcomeData
            on { getExpectedOutcomesForBurdenEstimateSet(any()) } doReturn listOf("cases", "dalys", "deaths")
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

        val result = sut.getBurdenEstimateData(1, groupId, touchstoneVersionId, scenarioId)

        //Test data objects
        Assertions.assertThat(result.data.toList().count()).isEqualTo(2)

        assertExpectedBurdenEstimate(result.data.first(), "YF", 2000, 20,
                "ABC", "ABC-Name", 0f,
                mapOf("cases" to 40f, "dalys" to 25.5f, "deaths" to 2f))

        assertExpectedBurdenEstimate(result.data.elementAt(1), "YF", 2000, 20,
                "DEF", "DEF-Name", 0f,
                mapOf("cases" to 10f, "dalys" to 5.5f, "deaths" to 1f))


        //Test serialization
        val stream = ByteArrayOutputStream()
        result.serialize(stream)
        val csv = StringReader(stream.toString())
                .use { CSVReader(it).readAll() }

        val firstRow = csv.first().toList() //headers

        Assertions.assertThat(firstRow.count()).isEqualTo(9)
        Assertions.assertThat(firstRow[0]).isEqualTo("disease")
        Assertions.assertThat(firstRow[1]).isEqualTo("year")
        Assertions.assertThat(firstRow[2]).isEqualTo("age")
        Assertions.assertThat(firstRow[3]).isEqualTo("country")
        Assertions.assertThat(firstRow[4]).isEqualTo("country_name")
        Assertions.assertThat(firstRow[5]).isEqualTo("cohort_size")
        Assertions.assertThat(firstRow[6]).isEqualTo("cases")
        Assertions.assertThat(firstRow[7]).isEqualTo("dalys")
        Assertions.assertThat(firstRow[8]).isEqualTo("deaths")


        var dataRow = csv.drop(1).first().toList()
        Assertions.assertThat(dataRow.count()).isEqualTo(9)
        Assertions.assertThat(dataRow[0]).isEqualTo("YF")
        Assertions.assertThat(dataRow[1]).isEqualTo("2000")
        Assertions.assertThat(dataRow[2]).isEqualTo("20")
        Assertions.assertThat(dataRow[3]).isEqualTo("ABC")
        Assertions.assertThat(dataRow[4]).isEqualTo("ABC-Name")
        Assertions.assertThat(dataRow[5]).isEqualTo("0.0") //missing cohort size should be emitted as zero
        Assertions.assertThat(dataRow[6]).isEqualTo("40.0")
        Assertions.assertThat(dataRow[7]).isEqualTo("25.5")
        Assertions.assertThat(dataRow[8]).isEqualTo("2.0")

        dataRow = csv.drop(2).first().toList()
        Assertions.assertThat(dataRow.count()).isEqualTo(9)
        Assertions.assertThat(dataRow[0]).isEqualTo("YF")
        Assertions.assertThat(dataRow[1]).isEqualTo("2000")
        Assertions.assertThat(dataRow[2]).isEqualTo("20")
        Assertions.assertThat(dataRow[3]).isEqualTo("DEF")
        Assertions.assertThat(dataRow[4]).isEqualTo("DEF-Name")
        Assertions.assertThat(dataRow[5]).isEqualTo("0.0") //missing cohort size should be emitted as zero
        Assertions.assertThat(dataRow[6]).isEqualTo("10.0")
        Assertions.assertThat(dataRow[7]).isEqualTo("5.5")
        Assertions.assertThat(dataRow[8]).isEqualTo("1.0")

    }

    private fun assertExpectedBurdenEstimate(estimateObj: BurdenEstimate, expectedDisease: String, expectedYear: Short,
                                             expectedAge: Short, expectedCountry: String, expectedCountryName: String,
                                             expectedCohortSize: Float, expectedOutcomes: Map<String, Float>)
    {
        Assertions.assertThat(estimateObj.disease).isEqualTo(expectedDisease)
        Assertions.assertThat(estimateObj.year).isEqualTo(expectedYear)
        Assertions.assertThat(estimateObj.age).isEqualTo(expectedAge)
        Assertions.assertThat(estimateObj.country).isEqualTo(expectedCountry)
        Assertions.assertThat(estimateObj.countryName).isEqualTo(expectedCountryName)
        Assertions.assertThat(estimateObj.cohortSize).isEqualTo(expectedCohortSize)

        Assertions.assertThat(estimateObj.outcomes.count()).isEqualTo(expectedOutcomes.count())
        expectedOutcomes.forEach { (key, value) -> Assertions.assertThat(estimateObj.outcomes[key]).isEqualTo(value) }
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
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

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
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

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
        val sut = RepositoriesBurdenEstimateLogic(groupRepo, repo, mockExpectationsRepository(), mock(), mock())
        sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        verify(groupRepo).getModellingGroup(groupId)
    }

    @Test
    fun `can close non-empty burden estimate set`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())
        sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        verify(repo).changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.COMPLETE)
    }

    @Test
    fun `cannot close empty burden estimate set`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(true)
        val repo = mockEstimatesRepository(writer)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

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
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

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
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

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
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

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
            on { getEstimates(any(), any(), any(), any()) } doReturn
                    BurdenEstimateDataSeries(BurdenEstimateGrouping.AGE, fakeEstimates)
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock())

        val result = sut.getEstimates(1, groupId, touchstoneVersionId, scenarioId, "test-outcome")
        assertThat(result.data).containsAllEntriesOf(fakeEstimates)
        verify(repo).getBurdenOutcomeIds("test-outcome")
    }

    @Test
    fun `checks that scenario exists when getting burden estimate sets`()
    {
        val repo = mock<ScenarioRepository> {
            on { checkScenarioDescriptionExists("s1") } doThrow UnknownObjectError("TEST", "scenario-description")
        }

        val sut = RepositoriesBurdenEstimateLogic(mock(), mock(), mock(), repo, mock())
        assertThatThrownBy {
            sut.getBurdenEstimateSets("g1", "t1", "s1")
        }.isInstanceOf(UnknownObjectError::class.java)
    }

    @Test
    fun `checks that scenario exists when getting burden estimate set`()
    {
        val repo = mock<ScenarioRepository> {
            on { checkScenarioDescriptionExists("s1") } doThrow UnknownObjectError("TEST", "scenario-description")
        }

        val sut = RepositoriesBurdenEstimateLogic(mock(), mock(), mock(), repo, mock())
        assertThatThrownBy {
            sut.getBurdenEstimateSet("g1", "t1", "s1", 1)
        }.isInstanceOf(UnknownObjectError::class.java)
    }

    @Test
    fun `can get burden estimate sets`()
    {
        val fakeEstimateSets = listOf(BurdenEstimateSet(1, Instant.now(), "someone",
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, ""),
                BurdenEstimateSetStatus.COMPLETE, listOf()))

        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSets("g1", "t1", "s1") } doReturn fakeEstimateSets
        }

        val sut = RepositoriesBurdenEstimateLogic(mock(), repo, mock(), mock(), mock())
        val result = sut.getBurdenEstimateSets("g1", "t1", "s1")
        assertThat(result).hasSameElementsAs(fakeEstimateSets)
    }

}