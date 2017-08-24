package org.vaccineimpact.api.tests.controllers.userController

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.UserController
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository

class CreateUserTests : UserControllerTests()
{
    @Test
    fun `can create user`()
    {
        val userRepo = mock<UserRepository>()

        val repos = mock<Repositories> {
            on { user } doReturn { userRepo }
            on { token } doReturn { mock() }
        }
        val model = CreateUser("user.name", "Full name", "email@example.com")
        val context = mock<ActionContext> {
            on { postData(CreateUser::class.java) } doReturn model
        }
        val controller = UserController(controllerContext())
        val location = controller.createUser(context, repos)
        verify(userRepo).addUser(any())
        Assertions.assertThat(location).endsWith("/v1/users/user.name/")
    }

    private fun controllerContext(): ControllerContext
    {
        return mockControllerContext(webTokenHelper = mock {
            on { generateOneTimeActionToken(any(), any(), anyOrNull(), any()) } doReturn "TOKEN"
        })
    }
}