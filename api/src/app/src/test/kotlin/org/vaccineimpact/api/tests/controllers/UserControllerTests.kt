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
import org.vaccineimpact.api.models.permissions.RoleAssignment

class UserControllerTests : ControllerTests<UserController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = UserController(controllerContext)

    @Test
    fun `getUserByUsername returns user`()
    {
        val userName = "test"
        val user = User("test", "test name", "test@test.com", null, listOf(RoleAssignment("member", "", "")))

        val controllerContext = mockControllerContext(mock<UserRepository> {
            on { this.getUserByUsername(userName) } doReturn user
        })
        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":username") } doReturn userName
        }

        val controller = UserController(controllerContext)
        assertThat(controller.getUser(context)).isEqualToComparingFieldByField(user)
    }

    @Test(expected = UnknownObjectError::class)
    fun `getUserByUsername throws error`()
    {
        val userName = "test"
        val user : User? = null

        val controllerContext = mockControllerContext(mock<UserRepository> {
            on { this.getUserByUsername(userName) } doReturn user
        })
        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":username") } doReturn userName
        }

        val controller = UserController(controllerContext)
        controller.getUser(context)
    }

    private fun mockControllerContext(repo: UserRepository)
            = mockControllerContext(RepositoryMock({ it.user }, repo))
}
