package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.db.nextDecimal
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.serialization.DataTable
import org.vaccineimpact.api.serialization.SplitData
import java.io.StringReader
import java.math.BigDecimal
import java.time.Instant
import java.util.*

class ModellingGroupControllersTests : ControllerTests<ModellingGroupController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = ModellingGroupController(controllerContext)

    @Test
    fun `can get model run params`()
    {
        val modelRunParameterSets = listOf(ModelRunParameterSet(1, "description", "model", "user", Instant.now()))

        val mockContext = mock<ActionContext> {
            on { params(":group-id") } doReturn "group-1"
            on { params(":touchstone-id") } doReturn "touchstone-1"
            on { params(":scenario-id") } doReturn "scenario-1"
        }

        val controller = makeController(mockControllerContext())
        val repo = mockRepository(modelRunParameterSets = modelRunParameterSets)

        assertThat(controller.getModelRunParameterSets(mockContext, repo)).isEqualTo(modelRunParameterSets)
    }

    @Test
    fun `throws UnknownObjectError if touchstone is in preparation when getting model run params`()
    {
        val mockContext = mock<ActionContext> {
            on { params(":group-id") } doReturn "group-1"
            on { params(":touchstone-id") } doReturn "touchstone-bad"
            on { params(":scenario-id") } doReturn "scenario-1"
        }

        val controller = makeController(mockControllerContext())
        val repo = mockRepository()

        assertThatThrownBy { controller.getModelRunParameterSets(mockContext, repo) }
                .isInstanceOf(UnknownObjectError::class.java)
    }

    @Test
    fun `can upload model run params`()
    {
        val params = mapOf("param1" to "value1", "param2" to "value2")
        val modelRuns = listOf<ModelRun>(ModelRun("run1", params))

        val mockContext = mock<ActionContext> {
            on { csvData<ModelRun>(any(), any()) } doReturn modelRuns.asSequence()
            on { username } doReturn "user.name"
            on { params(":group-id") } doReturn "group-1"
            on { params(":touchstone-id") } doReturn "touchstone-1"
            on { getPart("disease") } doReturn StringReader("disease-1")
            on { getPart("description") } doReturn StringReader("some description")
        }

        val controller = makeController(mockControllerContext())
        val repo = mockRepository(modelRuns = modelRuns)

        val expectedPath = "/v1/modelling-groups/group-1/model-run-parameters/11/"
        val objectCreationUrl = controller.addModelRunParameters(mockContext, repo)
        assertThat(objectCreationUrl).endsWith(expectedPath)
    }

    @Test
    fun `throws UnknownObjectError if touchstone is in preparation when adding model run params`()
    {
        val mockContext = mock<ActionContext> {
            on { params(":group-id") } doReturn "group-1"
            on { params(":touchstone-id") } doReturn "touchstone-bad"
            on { getPart("disease") } doReturn StringReader("disease-1")
        }

        val controller = makeController(mockControllerContext())
        val touchstoneSet = mockTouchstones()
        val repo = mockRepository(touchstoneSet)

        assertThatThrownBy { controller.addModelRunParameters(mockContext, repo) }
                .isInstanceOf(UnknownObjectError::class.java)
    }

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

    private fun mockRepository(touchstoneSet: SimpleDataSet<Touchstone, String> = mockTouchstones(),
                               modelRuns: List<ModelRun> = listOf(),
                               modelRunParameterSets: List<ModelRunParameterSet> = listOf()): BurdenEstimateRepository
    {
        val touchstoneRepo = mock<TouchstoneRepository> {
            on { touchstones } doReturn touchstoneSet
        }
        return mock {
            on { touchstoneRepository } doReturn touchstoneRepo
            on { it.getModelRunParameterSets(eq("group-1"), eq("touchstone-1")) } doReturn modelRunParameterSets
            on { it.addModelRunParameterSet(eq("group-1"), eq("touchstone-1"), eq("disease-1"),
                        eq("some description"),
                        eq(modelRuns), eq("user.name"), any())
            } doReturn 11
        }
    }

    private fun mockTouchstones() = mock<SimpleDataSet<Touchstone, String>> {
        on { get("touchstone-1") } doReturn Touchstone("touchstone-1", "touchstone", 1, "Description", TouchstoneStatus.OPEN)
        on { get("touchstone-bad") } doReturn Touchstone("touchstone-bad", "touchstone", 1, "not open", TouchstoneStatus.IN_PREPARATION)
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


}