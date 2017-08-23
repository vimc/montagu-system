package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.*
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.PasswordController
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.PasswordSetEmail
import org.vaccineimpact.api.security.MontaguUser
import org.vaccineimpact.api.security.UserProperties
import org.vaccineimpact.api.security.WebTokenHelper

class PasswordControllerTests : ControllerTests<PasswordController>()
{
    override fun makeController(controllerContext: ControllerContext): PasswordController
    {
        return PasswordController(controllerContext)
    }

    @Test
    fun `can set password`()
    {
        val repo = mock<UserRepository>()
        val model = SetPassword("new_password")
        val context = mock<ActionContext> {
            on { postData(SetPassword::class.java) } doReturn model
            on { username } doReturn "thisUser"
        }
        val controller = PasswordController(mockControllerContext())
        val response = controller.setPassword(context, repo)
        verify(repo).setPassword("thisUser", "new_password")
        assertThat(response).isEqualTo("OK")
    }

    @Test
    fun `can request set password email`()
    {
        val emailManager = mock<EmailManager>()
        val controller = makeControllerForLinkRequest(emailManager)
        val user = setupUserRepository(username = "username")
        assertThat(requestLinkWithThisUser(controller, user)).isEqualTo("OK")
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
        val controller = makeControllerForLinkRequest(emailManager)
        assertThat(requestLinkWithThisUser(controller, null)).isEqualTo("OK")
        verify(emailManager, never()).sendEmail(any(), any())
    }

    @Test
    fun `requesting set password email without email fails with error`()
    {
        val emailManager = mock<EmailManager>()
        val controller = makeControllerForLinkRequest(emailManager)
        assertThatThrownBy { controller.requestLink(mock(), mockRepositories(null)) }
                .isInstanceOf(MissingRequiredParameterError::class.java)
        verify(emailManager, never()).sendEmail(any(), any())
    }

    private fun requestLinkWithThisUser(controller: PasswordController, user: MontaguUser?): String
    {
        val repo = mockRepositories(user)
        val context = mock<ActionContext> {
            on { queryParams("email") } doReturn "fake@example.com"
        }
        return controller.requestLink(context, repo)
    }

    private fun mockRepositories(user: MontaguUser?): Repositories
    {
        val userRepo = mock<UserRepository> {
            on { getMontaguUserByEmail("fake@example.com") } doReturn user
        }
        return mock {
            on { this.user } doReturn { userRepo }
            on { this.token } doReturn { mock() }
        }
    }

    private fun makeControllerForLinkRequest(emailManager: EmailManager): PasswordController
    {
        val tokenHelper = mock<WebTokenHelper> {
            on { generateOneTimeActionToken(any(), any(), anyOrNull()) } doReturn "TOKEN"
        }
        return PasswordController(
                context = mockControllerContext(webTokenHelper = tokenHelper),
                emailManager = emailManager
        )
    }

    private fun setupUserRepository(username: String) = MontaguUser(
            UserProperties(username, "name", "fake@example.com", null, null),
            roles = emptyList(),
            permissions = emptyList()
    )
}