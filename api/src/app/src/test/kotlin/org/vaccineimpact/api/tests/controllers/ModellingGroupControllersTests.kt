package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import java.math.BigDecimal

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
        val context = mock<ActionContext>{
            on (it.params(":group-id")) doReturn "gId"
            on (it.permissions) doReturn PermissionSet()
        }

        val controller = ModellingGroupController(mockControllerContext())
        assertThatThrownBy {
            controller.modifyMembership(context, mock<UserRepository>())
        }.isInstanceOf(MissingRequiredPermissionError::class.java)
    }

    @Test
    fun `can modifyMembership if user has globally scoped permission to manage members`()
    {
        val context = mock<ActionContext>{
            on (it.params(":group-id")) doReturn "gId"
            on (it.permissions) doReturn PermissionSet(
                    setOf(ReifiedPermission("modelling-groups.manage-members",
                            Scope.Global())))
        }
        val controller = ModellingGroupController(mockControllerContext())
        controller.modifyMembership(context, mock<UserRepository>())
    }

    @Test
    fun `can modifyMembership if user has manage members permission scoped to group`()
    {
        val context = mock<ActionContext>{
            on (it.params(":group-id")) doReturn "gId"
            on (it.permissions) doReturn PermissionSet(
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
        val data = SplitData(coverageSets, DataTable.new(listOf(
                CoverageRow("sId", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN,
                        "ABC", "ABC-Name", 2000, BigDecimal.ZERO, BigDecimal.TEN, "0-10", null, BigDecimal("67.88"))
        )))
        return mock {
            on { getCoverageData(any(), any(), any()) } doReturn data
        }    }

    private fun mockCoverageSetsData(status: TouchstoneStatus) = ScenarioTouchstoneAndCoverageSets(
            Touchstone("tId", "t", 1, "desc", status),
            Scenario("sId", "scDesc", "disease", listOf("t-1")),
            listOf(
                    CoverageSet(1, "tId", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
            )
    )
}