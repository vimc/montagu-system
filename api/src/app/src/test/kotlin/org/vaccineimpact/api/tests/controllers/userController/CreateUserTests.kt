package org.vaccineimpact.api.tests.controllers.userController

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.NewStyleOneTimeLinkController
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.NewUserEmail
import org.vaccineimpact.api.emails.getEmailManager
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Duration

class CreateUserTests : MontaguTests()
{
    private val fakeToken = "TOKEN"
    private val name = "Full name"
    private val username = "user.name"
    private val email = "email@example.com"

    private val tokenHelperThatCanGenerateOnetimeTokens = mock<WebTokenHelper> {
        on { generateOneTimeActionToken(any(), any(), anyOrNull(), any(), any()) } doReturn fakeToken
        on { oneTimeLinkLifeSpan } doReturn Duration.ofSeconds(30)
    }

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
            tokenRepo: TokenRepository = mock<TokenRepository>(),
            emailManager: EmailManager = getEmailManager()
    ): String
    {
        val model = CreateUser(username, name, email)
        val context = mock<ActionContext> {
            on { postData(CreateUser::class.java) } doReturn model
        }

        val sut = NewStyleOneTimeLinkController(context,
                tokenRepo,
                userRepo,
                emailManager, tokenHelperThatCanGenerateOnetimeTokens)

        return sut.createUser()
    }

}