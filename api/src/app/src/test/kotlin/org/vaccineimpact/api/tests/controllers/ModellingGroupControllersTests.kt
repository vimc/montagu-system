package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.db.nextDecimal
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.serialization.DataTable
import org.vaccineimpact.api.serialization.SplitData
import java.math.BigDecimal
import java.util.*

class ModellingGroupControllersTests : ControllerTests<ModellingGroupController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = ModellingGroupController(controllerContext)

    @Test
    fun `getResponsibilities gets parameters from URL`()
    {
        val data = ResponsibilitiesAndTouchstoneStatus(
                Responsibilities("tId", "", null, emptyList()),
                TouchstoneStatus.FINISHED
        )
        val repo = mock<ModellingGroupRepository> {
            on { getResponsibilities(any(), any(), any()) } doReturn data
        }
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { hasPermission(any()) } doReturn true
        }

        val controller = ModellingGroupController(mockControllerContext())
        controller.getResponsibilities(context, repo)

        verify(repo).getResponsibilities(eq("gId"), eq("tId"), any())
    }

    @Test
    fun `getResponsibilities returns error if user does not have permission to see in-preparation touchstone`()
    {
        val data = ResponsibilitiesAndTouchstoneStatus(
                Responsibilities("tId", "", null, emptyList()),
                TouchstoneStatus.IN_PREPARATION
        )
        val repo = mock<ModellingGroupRepository> {
            on { getResponsibilities(any(), any(), any()) } doReturn data
        }
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { hasPermission(any()) } doReturn false
        }

        val controller = ModellingGroupController(mockControllerContext())
        assertThatThrownBy {
            controller.getResponsibilities(context, repo)
        }.hasMessageContaining("Unknown touchstone")
    }

    @Test
    fun `getResponsibility gets parameters from URL`()
    {
        val repo = makeRepoMockingGetResponsibility(TouchstoneStatus.OPEN)
        val context = mockContextForSpecificResponsibility(true)
        val controller = ModellingGroupController(mockControllerContext())
        controller.getResponsibility(context, repo)

        verify(repo).getResponsibility(eq("gId"), eq("tId"), eq("sId"))
    }

    @Test
    fun `getResponsibility returns error if user does not have permission to see in-preparation touchstone`()
    {
        val repo = makeRepoMockingGetResponsibility(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)
        val controller = ModellingGroupController(mockControllerContext())
        assertThatThrownBy { controller.getResponsibility(context, repo) }
                .hasMessageContaining("Unknown touchstone")
    }

    @Test
    fun `getCoverageSets gets parameters from URL`()
    {
        val repo = makeRepoMockingGetCoverageSets(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(true)
        val controller = ModellingGroupController(mockControllerContext())
        controller.getCoverageSets(context, repo)

        verify(repo).getCoverageSets(eq("gId"), eq("tId"), eq("sId"))
    }

    @Test
    fun `getCoverageSets returns error if user does not have permission to see in-preparation touchstone`()
    {
        val repo = makeRepoMockingGetCoverageSets(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)
        val controller = ModellingGroupController(mockControllerContext())
        assertThatThrownBy { controller.getCoverageSets(context, repo) }
                .hasMessageContaining("Unknown touchstone")
    }

    @Test
    fun `getCoverageData gets parameters from URL`()
    {
        val repo = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(true)
        val controller = ModellingGroupController(mockControllerContext())
        controller.getCoverageData(context, repo)
        verify(repo).getCoverageData(eq("gId"), eq("tId"), eq("sId"))
    }

    @Test
    fun `getCoverageData returns long format if format=long`()
    {
        val repo = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { it.queryParams("format") } doReturn "long"
            on { hasPermission(any()) } doReturn true
        }

        val controller = ModellingGroupController(mockControllerContext())
        val data = controller.getCoverageData(context, repo).data
        Assertions.assertThat(data.first() is LongCoverageRow).isTrue()
    }

    @Test
    fun `getCoverageData returns long format as default`()
    {
        val repo = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(true)

        val controller = ModellingGroupController(mockControllerContext())
        val data = controller.getCoverageData(context, repo).data

        // test data includes 5 years
        // there are 7 other variable properties, test data includes 2 of each
        val expectedRowCount = 5 * Math.pow(2.toDouble(), 7.toDouble())

        Assertions.assertThat(data.first() is LongCoverageRow).isTrue()
        Assertions.assertThat(data.count()).isEqualTo(expectedRowCount.toInt())
    }

    @Test
    fun `getCoverageData returns wide format if format=wide`()
    {
        val testYear = 1970
        val testTarget = BigDecimal(123.123)
        val testCoverage = BigDecimal(456.456)

        val repo = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION,
                testYear, testTarget, testCoverage)

        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { it.queryParams("format") } doReturn "wide"
            on { hasPermission(any()) } doReturn true
        }

        val controller = ModellingGroupController(mockControllerContext())
        val data = controller.getCoverageData(context, repo).data

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
    fun `wide format table is empty if long format is`()
    {
        val coverageSets = mockCoverageSetsData(TouchstoneStatus.IN_PREPARATION)
        val splitData = SplitData(coverageSets, DataTable.new(listOf<LongCoverageRow>().asSequence()))
        val repo = mock<ModellingGroupRepository> {
            on { getCoverageData(any(), any(), any()) } doReturn splitData
        }

        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { it.queryParams("format") } doReturn "wide"
            on { hasPermission(any()) } doReturn true
        }

        val controller = ModellingGroupController(mockControllerContext())
        val data = controller.getCoverageData(context, repo).data

        Assertions.assertThat(data.count()).isEqualTo(0)
    }

    private val years = listOf(1985, 1990, 1995, 2000)

    @Test
    fun `getCoverageData throw error if supplied format param is invalid`()
    {
        val repo = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { it.queryParams("format") } doReturn "78493hfjk"
            on { hasPermission(any()) } doReturn true
        }

        val controller = ModellingGroupController(mockControllerContext())

        Assertions.assertThatThrownBy { controller.getCoverageData(context, repo) }
                .isInstanceOf(BadRequest::class.java)
    }

    @Test
    fun `getCoverageData returns error if user does not have permission to see in-preparation touchstone`()
    {
        val repo = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)

        val controller = ModellingGroupController(mockControllerContext())
        assertThatThrownBy { controller.getCoverageData(context, repo) }
                .hasMessageContaining("Unknown touchstone")
    }

    @Test
    fun `modifyMembership returns error if user does not have permission to manage members`()
    {
        val context = mock<ActionContext> {
            on(it.params(":group-id")) doReturn "gId"
            on(it.permissions) doReturn PermissionSet()
        }

        val controller = ModellingGroupController(mockControllerContext())
        assertThatThrownBy {
            controller.modifyMembership(context, mock<UserRepository>())
        }.isInstanceOf(MissingRequiredPermissionError::class.java)
    }

    @Test
    fun `can modifyMembership if user has globally scoped permission to manage members`()
    {
        val context = mock<ActionContext> {
            on(it.params(":group-id")) doReturn "gId"
            on(it.permissions) doReturn PermissionSet(
                    setOf(ReifiedPermission("modelling-groups.manage-members",
                            Scope.Global())))
        }
        val controller = ModellingGroupController(mockControllerContext())
        controller.modifyMembership(context, mock<UserRepository>())
    }

    @Test
    fun `can modifyMembership if user has manage members permission scoped to group`()
    {
        val context = mock<ActionContext> {
            on(it.params(":group-id")) doReturn "gId"
            on(it.permissions) doReturn PermissionSet(
                    setOf(ReifiedPermission("modelling-groups.manage-members",
                            Scope.Specific("modelling-group", "gId"))))
        }
        val controller = ModellingGroupController(mockControllerContext())
        controller.modifyMembership(context, mock<UserRepository>())
    }

    private fun mockContextForSpecificResponsibility(hasPermissions: Boolean): ActionContext
    {
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { hasPermission(any()) } doReturn hasPermissions
        }
        return context
    }

    private fun makeRepoMockingGetResponsibility(status: TouchstoneStatus): ModellingGroupRepository
    {
        val data = ResponsibilityAndTouchstone(
                Touchstone("tId", "t", 1, "desc", status),
                Responsibility(
                        Scenario("sId", "scDesc", "disease", listOf("t-1")),
                        ResponsibilityStatus.EMPTY, emptyList(), null
                )
        )
        return mock {
            on { getResponsibility(any(), any(), any()) } doReturn data
        }
    }

    private fun makeRepoMockingGetCoverageSets(status: TouchstoneStatus) = mock<ModellingGroupRepository> {
        on { getCoverageSets(any(), any(), any()) } doReturn mockCoverageSetsData(status)
    }

    private fun makeRepoMockingGetCoverageData(status: TouchstoneStatus,
                                               testYear: Int = 1970,
                                               target: BigDecimal = BigDecimal(123.123),
                                               coverage: BigDecimal = BigDecimal(456.456)): ModellingGroupRepository
    {
        val coverageSets = mockCoverageSetsData(status)
        val fakeRows = generateCoverageRows(testYear, target, coverage)
        val data = SplitData(coverageSets, DataTable.new(fakeRows.asSequence()))
        return mock {
            on { getCoverageData(any(), any(), any()) } doReturn data
        }
    }

    private fun mockCoverageSetsData(status: TouchstoneStatus) = ScenarioTouchstoneAndCoverageSets(
            Touchstone("tId", "t", 1, "desc", status),
            Scenario("sId", "scDesc", "disease", listOf("t-1")),
            listOf(
                    CoverageSet(1, "tId", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
            )
    )

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


    private val random = Random(0)
}