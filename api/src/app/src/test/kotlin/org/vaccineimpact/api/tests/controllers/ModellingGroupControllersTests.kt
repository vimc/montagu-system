package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.models.Responsibilities
import org.vaccineimpact.api.models.ResponsibilitiesAndTouchstoneStatus
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.test_helpers.MontaguTests

class ModellingGroupControllersTests : MontaguTests()
{
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

        val controller = ModellingGroupController({ repo })
        controller.getResponsibilities(context)

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

        val controller = ModellingGroupController({ repo })
        assertThatThrownBy {
            controller.getResponsibilities(context)
        }.hasMessageContaining("Unknown touchstone")
    }
}