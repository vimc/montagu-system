package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.AuthenticationController
import org.vaccineimpact.api.app.logic.UserLogic
import org.vaccineimpact.api.app.requests.FormHelpers
import org.vaccineimpact.api.app.requests.HTMLForm
import org.vaccineimpact.api.app.security.internalUser
import org.vaccineimpact.api.models.FailedAuthentication
import org.vaccineimpact.api.models.SuccessfulAuthentication
import org.vaccineimpact.api.security.*
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Duration

class AuthenticationControllerTests : MontaguTests()
{
    private val fakeUser = InternalUser(UserProperties("testusername", "", "", "", null),
        listOf(),
        listOf())

    @Test
    fun `successful authentication returns compressed token and issues cookie`()
    {
        val fakeUserLogic = mock<UserLogic> {
            on { logInAndGetToken(any()) } doReturn "TOKEN"
        }

        val fakeProfile = CommonProfile()
        fakeProfile.internalUser = fakeUser

        val fakeContext = mock<ActionContext> {
            on { it.userProfile } doReturn fakeProfile
        }

        val fakeFormHelpers = mock<FormHelpers> {
            on {
                it.checkForm(fakeContext, mapOf("grant_type" to "client_credentials"))
            } doReturn (HTMLForm.ValidForm())
        }

        val fakeWebTokenHelper = mock<WebTokenHelper> {
            on { it.defaultLifespan } doReturn Duration.ofHours(1)
        }

        val sut = AuthenticationController(fakeContext, fakeUserLogic,
                fakeFormHelpers, fakeWebTokenHelper)

        val expectedToken = "TOKEN".deflated()
        assertThat(sut.authenticate()).isEqualTo(SuccessfulAuthentication(expectedToken, Duration.ofHours(1)))
        verify(fakeUserLogic).logInAndGetToken(fakeUser)
    }

    @Test
    fun `unsuccessful authentication returns problem`()
    {
        val fakeUserLogic = mock<UserLogic>()

        val fakeContext = mock<ActionContext>()
        val fakeFormHelpers = mock<FormHelpers> {
            on {
                it.checkForm(fakeContext, mapOf("grant_type" to "client_credentials"))
            } doReturn (HTMLForm.InvalidForm("problem"))
        }

        val fakeWebTokenHelper = mock<WebTokenHelper>()

        val sut = AuthenticationController(fakeContext, fakeUserLogic,
                fakeFormHelpers, fakeWebTokenHelper)

        assertThat(sut.authenticate()).isEqualTo(FailedAuthentication("problem"))
        verify(fakeUserLogic, never()).logInAndGetToken(any())
    }

    @Test
    fun `can set cookies`()
    {
        val fakeContext = mock<ActionContext> {
            on { username } doReturn "username"
        }
        val fakeUserLogic = mock<UserLogic> {
            on { getUserByUsername("username")} doReturn fakeUser
        }
        val fakeTokenHelper = mock<WebTokenHelper> {
            on { generateToken(fakeUser) } doReturn "MAIN_TOKEN"
            on { generateShinyToken(fakeUser) } doReturn "SHINY_TOKEN"
        }
        val sut = AuthenticationController(fakeContext, fakeUserLogic, mock(), fakeTokenHelper)

        sut.setCookies()
        verify(fakeContext).setCookie(eq(CookieName.Main), eq("MAIN_TOKEN"), any())
        verify(fakeContext).setCookie(eq(CookieName.Shiny), eq("SHINY_TOKEN"), any())
    }

    @Test
    fun `can clear cookies`()
    {
        val fakeContext = mock<ActionContext>()
        val sut = AuthenticationController(fakeContext, mock(), mock(), mock())
        sut.logOut()
        verify(fakeContext).setCookie(eq(CookieName.Main), eq(""), any())
        verify(fakeContext).setCookie(eq(CookieName.Shiny), eq(""), any())
    }
}
