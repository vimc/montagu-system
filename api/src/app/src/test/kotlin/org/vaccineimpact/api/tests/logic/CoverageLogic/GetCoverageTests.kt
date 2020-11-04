package org.vaccineimpact.api.tests.logic.CoverageLogic

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.logic.RepositoriesCoverageLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.inmemory.InMemoryDataSet
import org.vaccineimpact.api.db.nextDecimal
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.responsibilities.Responsibility
import org.vaccineimpact.api.models.responsibilities.ResponsibilityAndTouchstone
import org.vaccineimpact.api.models.responsibilities.ResponsibilityStatus
import org.vaccineimpact.api.serialization.DataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.math.BigDecimal
import java.util.*

class GetCoverageTests : MontaguTests()
{
    private val fakeScenario = Scenario("sId", "scDesc", "disease", listOf("t-1"))
    private val fakeTouchstoneVersion = TouchstoneVersion("touchstone-1", "touchstone", 1,
            "description", TouchstoneStatus.OPEN)

    private val groupId = "g1"
    private val responsibilityId = 11
    private fun responsibilityRepo() = mock<ResponsibilitiesRepository> {
        on { getResponsibility(groupId, fakeTouchstoneVersion.id, fakeScenario.id) } doReturn ResponsibilityAndTouchstone(responsibilityId,
                Responsibility(
                        fakeScenario,
                        ResponsibilityStatus.EMPTY, emptyList(), null
                ),
                fakeTouchstoneVersion)
    }

    private fun mockCoverageSetsData() = ScenarioAndCoverageSets(
            fakeScenario,
            listOf(CoverageSet(1, "tId", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN))
    )

    private fun scenarioRepo() = mock<ScenarioRepository> {
        on { getScenarioForTouchstone(fakeTouchstoneVersion.id, fakeScenario.id) } doReturn fakeScenario
    }

    private val fakeCoverageSets = listOf(
            CoverageSet(1, "tId", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
    )

    private fun touchstoneRepo(
            //provide these parameters to generate data
            testYear: Int = 1970,
            target: BigDecimal = BigDecimal(123.123),
            coverage: BigDecimal = BigDecimal(456.456),
            //provide this parameter to roll your own data
            coverageRows: List<GenderedLongCoverageRow>? = null ): TouchstoneRepository
    {
        val coverageSets = mockCoverageSetsData()
        val fakeRows = coverageRows ?: generateCoverageRows(testYear, target, coverage)
        val data = SplitData(coverageSets, DataTable.new(fakeRows.asSequence()))
        return mock {
            on { getScenarioAndCoverageData(fakeTouchstoneVersion.id, fakeScenario.id) } doReturn data
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(fakeTouchstoneVersion))
            on { getScenarioAndCoverageSets(fakeTouchstoneVersion.id, fakeScenario.id) } doReturn mockCoverageSetsData()
            on { getCoverageSetsForScenario(fakeTouchstoneVersion.id, fakeScenario.id) } doReturn fakeCoverageSets
            on { getCoverageDataForResponsibility(fakeTouchstoneVersion.id, responsibilityId, fakeScenario.id) } doReturn fakeRows.asSequence()
            on { getCoverageDataForScenario(fakeTouchstoneVersion.id, fakeScenario.id) } doReturn fakeRows.asSequence()
        }
    }

    @Test
    fun `can getCoverageDataForGroup`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo(), scenarioRepo(), mock())
        val result = sut.getCoverageDataForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id, format = null, allCountries = false)
        assertThat(result.structuredMetadata.scenario).isEqualTo(fakeScenario)
        assertThat(result.structuredMetadata.coverageSets).hasSameElementsAs(fakeCoverageSets)
        assertThat(result.structuredMetadata.touchstoneVersion).isEqualTo(fakeTouchstoneVersion)
    }

    @Test
    fun `getCoverageDataForGroup gets coverage for responsibility if allCountries is false`()
    {
        val touchstoneRepo = touchstoneRepo()
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo, scenarioRepo(), mock())

        sut.getCoverageDataForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id, format = null, allCountries = false)
        verify(touchstoneRepo).getCoverageDataForResponsibility(fakeTouchstoneVersion.id, responsibilityId, fakeScenario.id)
    }

    @Test
    fun `getCoverageDataForGroup gets general coverage data if allCountries is true`()
    {
        val touchstoneRepo = touchstoneRepo()
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo, scenarioRepo(), mock())

        sut.getCoverageDataForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id, format = null, allCountries = true)
        verify(touchstoneRepo).getCoverageDataForScenario(fakeTouchstoneVersion.id, fakeScenario.id)
    }

    @Test
    fun `getCoverageDataForGroup throws error if supplied format param is invalid`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo(), scenarioRepo(), mock())

        Assertions.assertThatThrownBy {
            sut.getCoverageDataForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id, format = "bad-format", allCountries = true)
        }.isInstanceOf(BadRequest::class.java)
    }

    @Test
    fun `getCoverageDataForGroup checks groups exists`()
    {
        val groupRepo = mock<ModellingGroupRepository>()
        val sut = RepositoriesCoverageLogic(groupRepo, responsibilityRepo(), touchstoneRepo(), scenarioRepo(), mock())

        sut.getCoverageDataForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id, format = null, allCountries = true)
        verify(groupRepo).getModellingGroup(groupId)
    }

    @Test
    fun `getCoverageDataForGroup gets responsibility for group`()
    {
        val repo = responsibilityRepo()
        val sut = RepositoriesCoverageLogic(mock(), repo, touchstoneRepo(), scenarioRepo(), mock())

        sut.getCoverageDataForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id, format = null, allCountries = true)
        verify(repo).getResponsibility(groupId, fakeTouchstoneVersion.id, fakeScenario.id)
    }

    @Test
    fun `can getCoverageData`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo(), scenarioRepo(), mock())
        sut.getCoverageData(fakeTouchstoneVersion.id, fakeScenario.id, null)
    }

    @Test
    fun `getCoverageData does not combine rows whose age range verbatim values differ`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(),
                touchstoneRepo(coverageRows=coverageRowsWithDifferentAgeRangeVerbatim),
                scenarioRepo(), mock())
        val data = sut.getCoverageData(fakeTouchstoneVersion.id, fakeScenario.id, format = null).data

        Assertions.assertThat(data.count()).isEqualTo(2)
        val firstRow = (data.first() as LongCoverageRow)
        Assertions.assertThat(firstRow.ageRangeVerbatim).isEqualTo("age_range_1")
        val secondRow = (data.elementAt(1) as LongCoverageRow)
        Assertions.assertThat(secondRow.ageRangeVerbatim).isEqualTo("age_range_2")
    }

    @Test
    fun `getCoverageData does not combine rows whose age range verbatim values differ if format=wide`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(),
                touchstoneRepo(coverageRows=coverageRowsWithDifferentAgeRangeVerbatim),
                scenarioRepo(), mock())
        val data = sut.getCoverageData(fakeTouchstoneVersion.id, fakeScenario.id, format = "wide").data

        Assertions.assertThat(data.count()).isEqualTo(2)
        val firstRow = (data.first() as WideCoverageRow)
        Assertions.assertThat(firstRow.ageRangeVerbatim).isEqualTo("age_range_1")
        val secondRow = (data.elementAt(1) as WideCoverageRow)
        Assertions.assertThat(secondRow.ageRangeVerbatim).isEqualTo("age_range_2")
    }

    @Test
    fun `getCoverageDataForGroup does not combine rows whose age range verbatim values differ`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(),
                touchstoneRepo(coverageRows=coverageRowsWithDifferentAgeRangeVerbatim),
                scenarioRepo(), mock())
        val data = sut.getCoverageDataForGroup(groupId,
                fakeTouchstoneVersion.id, fakeScenario.id, format = null, allCountries = true).data

        Assertions.assertThat(data.count()).isEqualTo(2)
        val firstRow = (data.first() as LongCoverageRow)
        Assertions.assertThat(firstRow.ageRangeVerbatim).isEqualTo("age_range_1")
        val secondRow = (data.elementAt(1) as LongCoverageRow)
        Assertions.assertThat(secondRow.ageRangeVerbatim).isEqualTo("age_range_2")
    }

    @Test
    fun `getCoverageDataForGroup does not combine rows whose age range verbatim values differ if format=wide`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(),
                                            touchstoneRepo(coverageRows=coverageRowsWithDifferentAgeRangeVerbatim),
                                            scenarioRepo(), mock())
        val data = sut.getCoverageDataForGroup(groupId,
                fakeTouchstoneVersion.id, fakeScenario.id, format = "wide", allCountries = true).data

        Assertions.assertThat(data.count()).isEqualTo(2)
        val firstRow = (data.first() as WideCoverageRow)
        Assertions.assertThat(firstRow.ageRangeVerbatim).isEqualTo("age_range_1")
        val secondRow = (data.elementAt(1) as WideCoverageRow)
        Assertions.assertThat(secondRow.ageRangeVerbatim).isEqualTo("age_range_2")
    }

    @Test
    fun `getCoverageDataForGroup returns wide format if format=wide`()
    {
        val testYear = 1970
        val testTarget = BigDecimal(123.123)
        val testCoverage = BigDecimal(456.456)

        val data = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo(), scenarioRepo(), mock())
                .getCoverageDataForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id, format = "wide", allCountries = true).data

        Assertions.assertThat(data.first() is WideCoverageRow).isTrue()

        // there are 7 variable properties, test data includes 2 of each
        val expectedRowCount = Math.pow(2.toDouble(), 7.toDouble())
        Assertions.assertThat(data.count()).isEqualTo(expectedRowCount.toInt())

        val expectedHeaders = listOf("target_$testYear", "coverage_$testYear",
                "coverage_1985", "coverage_1990", "coverage_1995", "coverage_2000",
                "target_1985", "target_1990", "target_1995", "target_2000")

        val firstRow = (data.first() as WideCoverageRow)
        val headers = firstRow.coverageAndTargetPerYear.keys

        Assertions.assertThat(headers).hasSameElementsAs(expectedHeaders)
        Assertions.assertThat(firstRow.coverageAndTargetPerYear["target_$testYear"] == testTarget)
        Assertions.assertThat(firstRow.coverageAndTargetPerYear["coverage_$testYear"] == testCoverage)
    }

    @Test
    fun `getCoverageDataForGroup returns WideCoverageRows with gender if data from repo has gender`()
    {
        val data = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo(), scenarioRepo(), mock())
                .getCoverageDataForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id, format = "wide", allCountries = true).data

        Assertions.assertThat(data.first()).isInstanceOf(GenderedWideCoverageRow::class.java)
        Assertions.assertThat((data.first() as GenderedWideCoverageRow).gender).isEqualTo("both")
    }

    @Test
    fun `getCoverageDataForGroup returns WideCoverageRows without gender if data has no gender`()
    {
        val fakeRows = listOf(
                NoGenderLongCoverageRow("sId", "set1", "vaccine1", GAVISupportLevel.GAVI_OPTIMISTIC, ActivityType.CAMPAIGN,
                        "country1", "Country-Name", 1970, BigDecimal(0), BigDecimal(10), "0-10",
                        random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2),
                        random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2))
        )

        val mockTouchstoneRepo =  mock<TouchstoneRepository> {
            on { getCoverageDataForScenario(fakeTouchstoneVersion.id, fakeScenario.id) } doReturn fakeRows.asSequence()
        }

        val data = RepositoriesCoverageLogic(mock(), responsibilityRepo(), mockTouchstoneRepo, scenarioRepo(), mock())
                .getCoverageDataForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id, format = "wide", allCountries = true).data

        Assertions.assertThat(data.first()).isInstanceOf(NoGenderWideCoverageRow::class.java)
    }

    @Test
    fun `getCoverageSetsForGroup checks responsibility for group exists`()
    {
        val responsibilitiesRepository = responsibilityRepo()
        val sut = RepositoriesCoverageLogic(mock(), responsibilitiesRepository, touchstoneRepo(), scenarioRepo(), mock())

        sut.getCoverageSetsForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id)
        verify(responsibilitiesRepository).getResponsibility(groupId, fakeTouchstoneVersion.id, fakeScenario.id)
    }

    @Test
    fun `getCoverageSetsForGroup checks group exists`()
    {
        val groupRepo = mock<ModellingGroupRepository>()
        val sut = RepositoriesCoverageLogic(groupRepo, responsibilityRepo(), touchstoneRepo(), scenarioRepo(), mock())

        sut.getCoverageSetsForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id)
        verify(groupRepo).getModellingGroup(groupId)
    }

    @Test
    fun `can get coverage sets for group`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo(), scenarioRepo(), mock())

        val result = sut.getCoverageSetsForGroup(groupId, fakeTouchstoneVersion.id, fakeScenario.id)
        checkMetadataIsAsExpected(result)
    }

    private fun checkMetadataIsAsExpected(result: ScenarioTouchstoneAndCoverageSets)
    {
        Assertions.assertThat(result.touchstoneVersion).isEqualTo(fakeTouchstoneVersion)
        Assertions.assertThat(result.scenario).isEqualTo(fakeScenario)
        Assertions.assertThat(result.coverageSets!![0].id).isEqualTo(1)
    }

    private val years = listOf(1985, 1990, 1995, 2000)

    private val random = Random(0)

    private val coverageRowsWithDifferentAgeRangeVerbatim = listOf(
            GenderedLongCoverageRow("sId", "set1", "vaccine1", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                    "ABC", "ABC-Name", 2000, BigDecimal(0), BigDecimal(5), "age_range_1",
                    random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2),
                    random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2),
                    "both"),
            GenderedLongCoverageRow("sId", "set1", "vaccine1", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                    "ABC", "ABC-Name", 2000, BigDecimal(0), BigDecimal(5), "age_range_2",
                    random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2),
                    random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2),
                    "both")
    )

    private fun generateCoverageRows(testYear: Int, target: BigDecimal, coverage: BigDecimal): List<GenderedLongCoverageRow>
    {
        val countries = listOf("ABC", "DEF")
        val setNames = listOf("set1", "set2")
        val vaccines = listOf("vaccine1", "vaccine2")
        val supportLevels = listOf(GAVISupportLevel.WITHOUT, GAVISupportLevel.WITH)
        val ageFroms = listOf(BigDecimal.ZERO, BigDecimal(5))
        val ageTos = listOf(BigDecimal.TEN, BigDecimal(5))
        val activityTypes = listOf(ActivityType.CAMPAIGN, ActivityType.NONE)

        val listToReturn = mutableListOf<GenderedLongCoverageRow>()

        for (country in countries)
        {
            for (set in setNames)
            {
                for (vaccine in vaccines)
                {
                    for (support in supportLevels)
                    {
                        for (ageFrom in ageFroms)
                        {
                            for (ageTo in ageTos)
                            {
                                for (activity in activityTypes)
                                {
                                    for (year in years)
                                    {
                                        listToReturn.add(GenderedLongCoverageRow("sId", set, vaccine, support, activity,
                                                country, "$country-Name", year, ageFrom, ageTo, "$ageFrom-$ageTo",
                                                random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2),
                                                random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2),
                                                "both"))
                                    }

                                    listToReturn.add(GenderedLongCoverageRow("sId", set, vaccine, support, activity,
                                            country, "$country-Name", testYear, ageFrom, ageTo, "$ageFrom-$ageTo",
                                            target,
                                            coverage,
                                            "both"))
                                }
                            }
                        }
                    }
                }
            }
        }

        // sort these randomly to emulate how they come out of the db
        return listToReturn.sortedBy { random.nextInt() }
    }

}