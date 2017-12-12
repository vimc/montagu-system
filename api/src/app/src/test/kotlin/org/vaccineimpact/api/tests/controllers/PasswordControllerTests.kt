package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.*
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.NewStyleOneTimeLinkController
import org.vaccineimpact.api.app.controllers.PasswordController
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.PasswordSetEmail
import org.vaccineimpact.api.security.MontaguUser
import org.vaccineimpact.api.security.UserProperties
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests

class PasswordControllerTests : MontaguTests()
{

    @Test
    fun `can set password`()
    {
        val repo = mock<UserRepository>()
        val model = SetPassword("new_password")
        val context = mock<ActionContext> {
            on { postData(SetPassword::class.java) } doReturn model
            on { username } doReturn "thisUser"
        }
        val sut = PasswordController(context, repo)
        val response = sut.setPassword()
        verify(repo).setPassword("thisUser", "new_password")
        assertThat(response).isEqualTo("OK")
    }

    @Test
    fun `can request set password email`()
    {
        val emailManager = mock<EmailManager>()

        val sut = NewStyleOneTimeLinkController(context, mock<TokenRepository>(),
                userRepo, emailManager, tokenHelper)

        assertThat(sut.requestResetPasswordLink()).isEqualTo("OK")
        verify(emailManager).sendEmail(check {
            if (it is PasswordSetEmail)
            {
                assertThat(it.token).isEqualTo("TOKEN")
                assertThat(it.recipientName).isEqualTo("name")
            }
            else
            {
                fail("Expected '$it' to be an instance of PasswordSetEmail")
            }
        }, argThat { this == user })
    }

    @Test
    fun `requesting set password email for unknown email fails silently`()
    {
        val emailManager = mock<EmailManager>()
        val context = mock<ActionContext> {
            on { queryParams("email") } doReturn "unknown@example.com"
        }
        val sut = NewStyleOneTimeLinkController(context, mock<TokenRepository>(),
                userRepo, emailManager, tokenHelper)
        assertThat(sut.requestResetPasswordLink()).isEqualTo("OK")
        verify(emailManager, never()).sendEmail(any(), any())
    }

    @Test
    fun `requesting set password email without email fails with error`()
    {
        val emailManager = mock<EmailManager>()
        val context = mock<ActionContext>()
        val sut = NewStyleOneTimeLinkController(context, mock<TokenRepository>(),
                userRepo, emailManager, tokenHelper)

        assertThatThrownBy { sut.requestResetPasswordLink() }
                .isInstanceOf(MissingRequiredParameterError::class.java)
        verify(emailManager, never()).sendEmail(any(), any())
    }

    private val user = MontaguUser(
            UserProperties("fake.user", "name", "fake@example.com", null, null),
            roles = emptyList(),
            permissions = emptyList()
    )

    private val context = mock<ActionContext> {
        on { queryParams("email") } doReturn "fake@example.com"
    }

    private val tokenHelper = mock<WebTokenHelper> {
        on { generateOneTimeActionToken(any(), any(), anyOrNull(), any(), any()) } doReturn "TOKEN"
    }

    private val userRepo = mock<UserRepository> {
        on { getMontaguUserByEmail("fake@example.com") } doReturn user
    }

}