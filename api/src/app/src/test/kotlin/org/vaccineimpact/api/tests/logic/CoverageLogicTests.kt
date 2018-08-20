package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.logic.RepositoriesCoverageLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
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

class CoverageLogicTests : MontaguTests()
{
    private val fakeScenario = Scenario("sId", "scDesc", "disease", listOf("t-1"))
    private val fakeTouchstoneVersion = TouchstoneVersion("touchstone-1", "touchstone", 1,
            "description", TouchstoneStatus.OPEN)

    private fun responsibilityRepo() = mock<ResponsibilitiesRepository> {
        on { getResponsibility(any(), any(), any()) } doReturn ResponsibilityAndTouchstone(1,
                Responsibility(
                        fakeScenario,
                        ResponsibilityStatus.EMPTY, emptyList(), null
                ),
                fakeTouchstoneVersion)
    }

    private fun mockCoverageSetsData() = ScenarioAndCoverageSets(
            fakeScenario,
            listOf(
                    CoverageSet(1, "tId", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
            )
    )

    private fun touchstoneRepo(
            testYear: Int = 1970,
            target: BigDecimal = BigDecimal(123.123),
            coverage: BigDecimal = BigDecimal(456.456)): TouchstoneRepository
    {
        val coverageSets = mockCoverageSetsData()
        val fakeRows = generateCoverageRows(testYear, target, coverage)
        val data = SplitData(coverageSets, DataTable.new(fakeRows.asSequence()))
        return mock {
            on { getScenarioAndCoverageData(any(), any()) } doReturn data
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(fakeTouchstoneVersion))
            on { getScenario(any(), any()) } doReturn mockCoverageSetsData()
        }
    }

    @Test
    fun `getCoverageDataForGroup throws error if supplied format param is invalid`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo())

        Assertions.assertThatThrownBy {
            sut.getCoverageDataForGroup("gId", "tId", "s1", "bad-format")
        }.isInstanceOf(BadRequest::class.java)
    }

    @Test
    fun `getCoverageDataForGroup checks groups exists`()
    {
        val groupRepo = mock<ModellingGroupRepository>()
        val sut = RepositoriesCoverageLogic(groupRepo, responsibilityRepo(), touchstoneRepo())

        sut.getCoverageDataForGroup("gId", "tId", "s1", null)
        verify(groupRepo).getModellingGroup("gId")
    }

    @Test
    fun `getCoverageDataForGroup gets responsibility for group`()
    {
        val repo = responsibilityRepo()
        val sut = RepositoriesCoverageLogic(mock(), repo, touchstoneRepo())

        sut.getCoverageDataForGroup("gId", "tId", "s1", null)
        verify(repo).getResponsibility("gId", "tId", "s1")
    }

    @Test
    fun `can getCoverageData`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo())
        sut.getCoverageData("touchstone-1", "s1", null)
    }

    @Test
    fun `getCoverageDataForGroup returns wide format if format=wide`()
    {
        val testYear = 1970
        val testTarget = BigDecimal(123.123)
        val testCoverage = BigDecimal(456.456)

        val data = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo())
                .getCoverageDataForGroup("gId", "tId", "s1", "wide").data

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
    fun `getCoverageSetsForGroup checks responsibility for group exists`()
    {
        val responsibilitiesRepository = responsibilityRepo()
        val sut = RepositoriesCoverageLogic(mock(), responsibilitiesRepository, touchstoneRepo())

        sut.getCoverageSetsForGroup("gId", "tId", "s1")
        verify(responsibilitiesRepository).getResponsibility("gId", "tId", "s1")
    }

    @Test
    fun `getCoverageSetsForGroup checks group exists`()
    {
        val groupRepo = mock<ModellingGroupRepository>()
        val sut = RepositoriesCoverageLogic(groupRepo, responsibilityRepo(), touchstoneRepo())

        sut.getCoverageSetsForGroup("gId", "tId", "s1")
        verify(groupRepo).getModellingGroup("gId")
    }

    @Test
    fun `can get coverage sets for group`()
    {
        val sut = RepositoriesCoverageLogic(mock(), responsibilityRepo(), touchstoneRepo())

        val result = sut.getCoverageSetsForGroup("gId", "tId", "s1")
        checkMetadataIsAsExpected(result)
    }

    private fun checkMetadataIsAsExpected(result: ScenarioTouchstoneAndCoverageSets)
    {
        Assertions.assertThat(result.touchstoneVersion).isEqualTo(fakeTouchstoneVersion)
        Assertions.assertThat(result.scenario).isEqualTo(fakeScenario)
        Assertions.assertThat(result.coverageSets[0].id).isEqualTo(1)
    }

    private val years = listOf(1985, 1990, 1995, 2000)

    private val random = Random(0)

    private fun generateCoverageRows(testYear: Int, target: BigDecimal, coverage: BigDecimal): List<LongCoverageRow>
    {
        val countries = listOf("ABC", "DEF")
        val setNames = listOf("set1", "set2")
        val vaccines = listOf("vaccine1", "vaccine2")
        val supportLevels = listOf(GAVISupportLevel.WITHOUT, GAVISupportLevel.WITH)
        val ageFroms = listOf(BigDecimal.ZERO, BigDecimal(5))
        val ageTos = listOf(BigDecimal.TEN, BigDecimal(5))
        val activityTypes = listOf(ActivityType.CAMPAIGN, ActivityType.NONE)

        val listToReturn = mutableListOf<LongCoverageRow>()

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
                                        listToReturn.add(LongCoverageRow("sId", set, vaccine, support, activity,
                                                country, "$country-Name", year, ageFrom, ageTo, "$ageFrom-$ageTo",
                                                random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2),
                                                random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2)))
                                    }

                                    listToReturn.add(LongCoverageRow("sId", set, vaccine, support, activity,
                                            country, "$country-Name", testYear, ageFrom, ageTo, "$ageFrom-$ageTo",
                                            target,
                                            coverage))
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