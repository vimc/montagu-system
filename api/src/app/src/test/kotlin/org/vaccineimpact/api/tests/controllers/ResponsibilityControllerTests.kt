package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.ResponsibilityController
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.test_helpers.MontaguTests

class ResponsibilityControllerTests : MontaguTests()
{
    @Test
    fun `returns in preparation touchstones if user has permission to read prepared touchstones`()
    {
        val groupId = "test-group"
        val repo = mock<ModellingGroupRepository> {
            on { getTouchstonesByGroupId(groupId) } doReturn mockTouchstones
        }

        val context = mock<ActionContext> {
            on { params(":group-id") } doReturn groupId
            on { hasPermission(ReifiedPermission.parse("*/touchstones.prepare")) } doReturn true
        }
        val data = ResponsibilityController(context, repo).getResponsibleTouchstones()
        assertThat(data.count()).isEqualTo(2)
    }

    @Test
    fun `does not return in preparation touchstones if user has no permission to read prepared touchstones`()
    {
        val groupId = "test-group"
        val repo = mock<ModellingGroupRepository> {
            on { getTouchstonesByGroupId(groupId) } doReturn mockTouchstones
        }

        val context = mock<ActionContext> {
            on { params(":group-id") } doReturn groupId
            on { hasPermission(ReifiedPermission.parse("*/touchstones.prepare")) } doReturn false
        }
        val data = ResponsibilityController(context, repo).getResponsibleTouchstones()
        assertThat(data.count()).isEqualTo(1)
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

        ResponsibilityController(context, repo).getResponsibilities()

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

        Assertions.assertThatThrownBy {
            ResponsibilityController(context, repo).getResponsibilities()
        }.hasMessageContaining("Unknown touchstone")
    }

    @Test
    fun `getResponsibility gets parameters from URL`()
    {
        val repo = makeRepoMockingGetResponsibility(TouchstoneStatus.OPEN)
        val context = mockContextForSpecificResponsibility(true)

        ResponsibilityController(context, repo).getResponsibility()

        verify(repo).getResponsibility(eq("gId"), eq("tId"), eq("sId"))
    }

    @Test
    fun `getResponsibility returns error if user does not have permission to see in-preparation touchstone`()
    {
        val repo = makeRepoMockingGetResponsibility(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)
        Assertions.assertThatThrownBy {
            ResponsibilityController(context, repo).getResponsibility()
        }.hasMessageContaining("Unknown touchstone")
    }


    private val mockTouchstones = listOf(
            Touchstone("touchstone-1", "touchstone", 1, "Description", TouchstoneStatus.OPEN),
            Touchstone("touchstone-bad", "touchstone", 1, "not open", TouchstoneStatus.IN_PREPARATION)
    )

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