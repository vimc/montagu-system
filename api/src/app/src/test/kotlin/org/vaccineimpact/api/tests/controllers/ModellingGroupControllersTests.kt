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
            ModellingGroupController(context, mock(), mock()).modifyMembership()
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
        val controller = ModellingGroupController(context, mock(), mock())
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
        val controller = ModellingGroupController(context, mock(), mock())
        controller.modifyMembership()
    }

    @Test
    fun `can get context user modelling groups`()
    {
        val context = mock<ActionContext>{
            on(it.username) doReturn "test-user"
        }

        val user = InternalUser(UserProperties("test-user", "Test User", "test@user.com",
                                null, null),
                listOf(
                        ReifiedRole("member", Scope.Specific("modelling-group", "group-1")),
                        ReifiedRole("member", Scope.Specific("modelling-group", "group-2")),
                        ReifiedRole("some-other-role", Scope.Specific("modelling-group", "group-3")),
                        ReifiedRole("member", Scope.Global())
                ),
                listOf()
        )

        val userRepo = mock<UserRepository>{
            on (it.getUserByUsername("test-user")) doReturn user
        }

        val expectedResult = listOf(
                ModellingGroup("group-1", "first group"),
                ModellingGroup("group2", "second group")
        )
        val groupRepo = mock<ModellingGroupRepository>{
            on (it.getModellingGroups(arrayOf("group-1", "group-2"))) doReturn expectedResult
        }

        val controller = ModellingGroupController(context, groupRepo, userRepo)

        val result = controller.getContextUserModellingGroups()

        verify(context).username
        verify(userRepo).getUserByUsername("test-user")

        assertThat(result).isEqualTo(expectedResult)

    }
}