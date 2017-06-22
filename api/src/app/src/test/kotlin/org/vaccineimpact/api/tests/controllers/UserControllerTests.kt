package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.UserController
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.RoleAssignment

class UserControllerTests : ControllerTests<UserController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = UserController(controllerContext)

    @Test
    fun `getUserByUsername returns user without roles`()
    {
        val userName = "test"
        val user = User("test", "test name", "test@test.com", null)

        val controllerContext = mockControllerContext(mock<UserRepository> {
            on { this.getUserByUsername(userName) } doReturn user
        })
        val context = mock<ActionContext> {
            on { hasPermission(ReifiedPermission("users.read", Scope.Global())) } doReturn true
            on { hasPermission(ReifiedPermission("roles.read", Scope.Global())) } doReturn false
            on { params(":username") } doReturn userName
        }

        val controller = UserController(controllerContext)
        assertThat(controller.getUser(context)).isEqualToComparingFieldByField(user)
    }

    @Test
    fun `getUserByUsername returns user with roles`()
    {
        val userName = "test"
        val user = UserWithRoles("test", "test name", "test@test.com", null, listOf(RoleAssignment("member", "", "")))

        val controllerContext = mockControllerContext(mock<UserRepository> {
            on { this.getUserByUsernameWithRoles(userName) } doReturn user
        })
        val context = mock<ActionContext> {
            on { hasPermission(ReifiedPermission("users.read", Scope.Global())) } doReturn true
            on { hasPermission(ReifiedPermission("roles.read", Scope.Global())) } doReturn true
            on { params(":username") } doReturn userName
        }

        val controller = UserController(controllerContext)
        assertThat(controller.getUser(context)).isEqualToComparingFieldByField(user)
    }

    private fun mockControllerContext(repo: UserRepository)
            = mockControllerContext(RepositoryMock({ it.user }, repo))
}
