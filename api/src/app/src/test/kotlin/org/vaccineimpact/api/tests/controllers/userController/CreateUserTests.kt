package org.vaccineimpact.api.tests.controllers.userController

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.UserController
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.NewUserEmail
import org.vaccineimpact.api.emails.getEmailManager

class CreateUserTests : UserControllerTests()
{
    private val fakeToken = "TOKEN"
    private val name = "Full name"
    private val username = "user.name"
    private val email = "email@example.com"

    @Test
    fun `can create user`()
    {
        val userRepo = mock<UserRepository>()
        val repos = makeRepos(userRepo)
        val location = postToUserCreate(repos = repos)
        verify(userRepo).addUser(any())
        assertThat(location).endsWith("/v1/users/user.name/")
    }

    @Test
    fun `creating user sends email with password set link`()
    {
        val emailManager = mock<EmailManager>()
        postToUserCreate(emailManager = emailManager)
        verify(emailManager).sendEmail(
                check {
                    if (it is NewUserEmail)
                    {
                        assertThat(it.user.name).isEqualTo(name)
                        assertThat(it.token).isEqualTo(fakeToken)
                    }
                    else
                    {
                        fail("Expected email to be NewUserEmail")
                    }
                },
                check {
                    assertThat(it.email).isEqualTo(email)
                    assertThat(it.username).isEqualTo(username)
                    assertThat(it.name).isEqualTo(name)
                }
        )
    }

    private fun makeRepos(userRepo: UserRepository = mock()): Repositories
    {
        return mock {
            on { user } doReturn userRepo
            on { token } doReturn mock<TokenRepository>()
        }
    }

    private fun postToUserCreate(
            repos: Repositories = makeRepos(),
            emailManager: EmailManager = getEmailManager()
    ): String
    {
        val model = CreateUser(username, name, email)
        val context = mock<ActionContext> {
            on { postData(CreateUser::class.java) } doReturn model
        }
        val controller = UserController(controllerContext(), emailManager)
        return controller.createUser(context, repos)
    }

    private fun controllerContext(): ControllerContext
    {
        return mockControllerContext(webTokenHelper = mock {
            on { generateOneTimeActionToken(any(), any(), anyOrNull(), any(), any()) } doReturn fakeToken
        })
    }
}