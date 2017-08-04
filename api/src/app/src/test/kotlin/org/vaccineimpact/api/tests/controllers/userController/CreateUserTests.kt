package org.vaccineimpact.api.tests.controllers.userController

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.UserController
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.UserRepository

class CreateUserTests : UserControllerTests()
{
    @Test
    fun `can create user`()
    {
        val repo = mock<UserRepository>()
        val model = CreateUser("user.name", "Full name", "email@example.com")
        val context = mock<ActionContext> {
            on { postData(CreateUser::class.java) } doReturn model
        }
        val controller = UserController(mockControllerContext())
        val location = controller.createUser(context, repo)
        verify(repo).addUser(any())
        Assertions.assertThat(location).isEqualTo("unit_test_root/v1/users/user.name/")
    }
}