package org.vaccineimpact.api.tests.controllers.coverage

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.CoverageController
import org.vaccineimpact.api.app.logic.CoverageLogic
import org.vaccineimpact.api.db.nextDecimal
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.DataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.math.BigDecimal
import java.util.*

class CoverageControllerTests : MontaguTests()
{
    @Test
    fun `getCoverageSetsForGroup gets parameters from URL`()
    {
        val logic = makeLogicMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(true)
        CoverageController(context, logic, mock()).getCoverageSetsForGroup()

        verify(logic).getCoverageSetsForGroup(eq("gId"), eq("tId"), eq("sId"))
    }

    @Test
    fun `getCoverageSetsForGroup returns error if user does not have permission to see in-preparation touchstone`()
    {
        val logic = makeLogicMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)
        Assertions.assertThatThrownBy {
            CoverageController(context, logic, mock()).getCoverageSetsForGroup()
        }.hasMessageContaining("Unknown touchstone-version")
    }

    @Test
    fun `getCoverageDataForGroup gets parameters from URL`()
    {
        val logic = makeLogicMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(true)
        CoverageController(context, logic, mock()).getCoverageDataForGroup()
        verify(logic).getCoverageDataForGroup(eq("gId"), eq("tId"), eq("sId"), eq(false), isNull())
    }

    @Test
    fun `getCoverageDataForGroup returns long format if format=long`()
    {
        val logic = makeLogicMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { it.queryParams("format") } doReturn "long"
            on { hasPermission(any()) } doReturn true
        }

        val data = CoverageController(context, logic, mock())
                .getCoverageDataForGroup().data
        Assertions.assertThat(data.first() is LongCoverageRow).isTrue()
    }

    @Test
    fun `getCoverageDataForGroup returns data for all countries if all-countries=true`()
    {
        val logic = makeLogicMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { it.queryParams("all-countries") } doReturn "true"
            on { hasPermission(any()) } doReturn true
        }

        CoverageController(context, logic, mock())
                .getCoverageDataForGroup().data
        verify(logic).getCoverageDataForGroup("gId", "tId", "sId", true, null)
    }

    @Test
    fun `getCoverageDataForGroup does not return data for all countries if all-countries=false`()
    {
        val logic = makeLogicMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { it.queryParams("all-countries") } doReturn "false"
            on { hasPermission(any()) } doReturn true
        }

        CoverageController(context, logic, mock())
                .getCoverageDataForGroup().data
        verify(logic).getCoverageDataForGroup("gId", "tId", "sId", false, null)
    }

    @Test
    fun `getCoverageDataForGroup does not return data for all countries by default`()
    {
        val logic = makeLogicMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { hasPermission(any()) } doReturn true
        }

        CoverageController(context, logic, mock())
                .getCoverageDataForGroup().data
        verify(logic).getCoverageDataForGroup("gId", "tId", "sId", false, null)
    }

    @Test
    fun `getCoverageDataForGroup returns long format as default`()
    {
        val logic = makeLogicMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(true)

        val data = CoverageController(context, logic, mock())
                .getCoverageDataForGroup().data

        // test data includes 5 years
        // there are 7 other variable properties, test data includes 2 of each
        val expectedRowCount = 5 * Math.pow(2.toDouble(), 7.toDouble())

        Assertions.assertThat(data.first() is LongCoverageRow).isTrue()
        Assertions.assertThat(data.count()).isEqualTo(expectedRowCount.toInt())
    }

    @Test
    fun `wide format table is empty if long format is`()
    {
        val coverageSets = mockCoverageSetsData(TouchstoneStatus.IN_PREPARATION)
        val splitData = SplitData(coverageSets, DataTable.new(listOf<GenderedLongCoverageRow>().asSequence()))
        val logic = mock<CoverageLogic> {
            on { getCoverageDataForGroup(any(), any(), any(), any(), anyOrNull()) } doReturn splitData
        }

        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { it.queryParams("format") } doReturn "wide"
            on { hasPermission(any()) } doReturn true
        }

        val data = CoverageController(context, logic, mock())
                .getCoverageDataForGroup().data

        Assertions.assertThat(data.count()).isEqualTo(0)
    }

    private val years = listOf(1985, 1990, 1995, 2000)

    @Test
    fun `getCoverageDataForGroup returns error if user does not have permission to see in-preparation touchstone`()
    {
        val logic = makeLogicMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)

        Assertions.assertThatThrownBy {
            CoverageController(context, logic, mock()).getCoverageDataForGroup()
        }.hasMessageContaining("Unknown touchstone-version")
    }

    private fun mockContextForSpecificResponsibility(hasPermissions: Boolean): ActionContext
    {
        return mock {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { hasPermission(any()) } doReturn hasPermissions
        }
    }

    private fun makeLogicMockingGetCoverageData(status: TouchstoneStatus,
                                                testYear: Int = 1970,
                                                target: BigDecimal = BigDecimal(123.123),
                                                coverage: BigDecimal = BigDecimal(456.456)): CoverageLogic
    {
        val coverageSets = mockCoverageSetsData(status)
        val fakeRows = generateCoverageRows(testYear, target, coverage)
        val data = SplitData(coverageSets, DataTable.new(fakeRows.asSequence()))
        return mock {
            on { getCoverageDataForGroup(any(), any(), any(), any(), anyOrNull()) } doReturn data
            on { getCoverageSetsForGroup(any(), any(), any()) } doReturn mockCoverageSetsData(status)
        }
    }

    private fun mockCoverageSetsData(status: TouchstoneStatus) = ScenarioTouchstoneAndCoverageSets(
            TouchstoneVersion("tId", "t", 1, "desc", status),
            Scenario("sId", "scDesc", "disease", listOf("t-1")),
            listOf(
                    CoverageSet(1, "tId", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
            )
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


    private val random = Random(0)
}