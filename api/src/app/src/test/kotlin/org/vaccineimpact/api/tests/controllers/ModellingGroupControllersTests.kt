package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.db.nextDecimal
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
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
        Assertions.assertThat(data.first() is CoverageRow).isTrue()
    }

    @Test
    fun `getCoverageData returns long format as default`()
    {
        val repo = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(true)

        val controller = ModellingGroupController(mockControllerContext())
        val data = controller.getCoverageData(context, repo).data

        // test data includes 4 years
        // there are 7 other variable properties, test data includes 2 of each
        val expectedRowCount = 4 * Math.pow(2.toDouble(), 7.toDouble())

        Assertions.assertThat(data.first() is CoverageRow).isTrue()
        Assertions.assertThat(data.count()).isEqualTo(expectedRowCount.toInt())
    }

    @Test
    fun `getCoverageData returns wide format if format=wide`()
    {
        val repo = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
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

        val expectedHeaders = listOf("1985_coverage", "1990_coverage", "1995_coverage", "2000_coverage",
                "1985_target", "1990_target", "1995_target", "2000_target")

        Assertions.assertThat((data.first() as WideCoverageRow).coverageAndTargetPerYear.keys)
                .hasSameElementsAs(expectedHeaders)
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

    private fun makeRepoMockingGetCoverageData(status: TouchstoneStatus): ModellingGroupRepository
    {
        val coverageSets = mockCoverageSetsData(status)
        val fakeRows = generateCoverageRows()
        val data = SplitData(coverageSets, DataTable.new(fakeRows))
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

    private fun generateCoverageRows(): List<CoverageRow>
    {
        val countries = listOf("ABC", "DEF")
        val setNames = listOf("set1", "set2")
        val vaccines = listOf("vaccine1", "vaccine2")
        val supportLevels = listOf(GAVISupportLevel.WITHOUT, GAVISupportLevel.WITH)
        val ageFroms = listOf(BigDecimal.ZERO, BigDecimal(5))
        val ageTos = listOf(BigDecimal.TEN, BigDecimal(5))
        val activityTypes = listOf(ActivityType.CAMPAIGN, ActivityType.NONE)

        val listToReturn = mutableListOf<CoverageRow>()

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
                                        listToReturn.add(CoverageRow("sId", set, vaccine, support, activity,
                                                country, "$country-Name", year, ageFrom, ageTo, "$ageFrom-$ageTo",
                                                random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2),
                                                random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2)))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return listToReturn
    }


    private val random = Random(0)
}