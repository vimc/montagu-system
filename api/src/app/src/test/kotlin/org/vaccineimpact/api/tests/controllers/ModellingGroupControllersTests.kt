package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.logic.ModellingGroupLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.ModellingGroup
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.UserProperties
import org.vaccineimpact.api.test_helpers.MontaguTests

class ModellingGroupControllersTests : MontaguTests()
{
    @Test
    fun `modifyMembership returns error if user does not have permission to manage members`()
    {
        val context = mock<ActionContext> {
            on(it.params(":group-id")) doReturn "gId"
            on(it.permissions) doReturn PermissionSet()
        }
        assertThatThrownBy {
            ModellingGroupController(context, mock(), mock(), mock()).modifyMembership()
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
        val controller = ModellingGroupController(context, mock(), mock(), mock())
        controller.modifyMembership()
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
        val controller = ModellingGroupController(context, mock(), mock(), mock())
        controller.modifyMembership()
    }

    @Test
    fun `can get context user modelling groups`()
    {
        val context = mock<ActionContext>{
            on(it.username) doReturn "test-user"
        }

        val expectedResult = listOf(
                ModellingGroup("group-1", "first group"),
                ModellingGroup("group2", "second group")
        )

        val logic = mock<ModellingGroupLogic>{
            on(it.getUserModellingGroups("test-user")) doReturn expectedResult
        }


        val controller = ModellingGroupController(context, mock(), mock(), logic)

        val result = controller.getContextUserModellingGroups()

        verify(context).username

        assertThat(result).isEqualTo(expectedResult)

    }
}