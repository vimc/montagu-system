package org.vaccineimpact.api.tests.controllers.userController

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.OneTimeTokenGenerator
import org.vaccineimpact.api.app.controllers.UserController
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.NewUserEmail
import org.vaccineimpact.api.emails.getEmailManager
import org.vaccineimpact.api.test_helpers.MontaguTests

class CreateUserTests : MontaguTests()
{
    private val fakeToken = "TOKEN"
    private val name = "Full name"
    private val username = "user.name"
    private val email = "email@example.com"

    @Test
    fun `can create user`()
    {
        val userRepo = mock<UserRepository>()
        val location = postToUserCreate(userRepo)
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


    private fun postToUserCreate(
            userRepo: UserRepository = mock<UserRepository>(),
            emailManager: EmailManager = getEmailManager()
    ): String
    {
        val model = CreateUser(username, name, email)
        val context = mock<ActionContext> {
            on { postData(CreateUser::class.java) } doReturn model
        }

        val tokenGenerator = mock<OneTimeTokenGenerator> {
            on { getOneTimeLinkToken(any(), any(), anyOrNull(), anyOrNull(), any(), any()) } doReturn fakeToken
        }
        val sut = UserController(context,
                userRepo,
                tokenGenerator,
                emailManager)

        return sut.createUser()
    }

}