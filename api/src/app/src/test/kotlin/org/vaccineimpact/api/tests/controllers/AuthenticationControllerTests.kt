package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.junit.Test
import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.AuthenticationController
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.requests.FormHelpers
import org.vaccineimpact.api.app.requests.HTMLForm
import org.vaccineimpact.api.app.security.internalUser
import org.vaccineimpact.api.db.ConfigWrapper
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.security.UserProperties
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Duration

class AuthenticationControllerTests : MontaguTests()
{
    private val fakeUser = InternalUser(UserProperties("testusername", "", "", "", null),
        listOf(),
        listOf())

    @Test
    fun `successful authentication updates last logged in timestamp`()
    {
        val fakeUserRepo = mock<UserRepository>()

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
            on { it.generateToken(fakeUser) } doReturn "token"
            on { it.lifeSpan } doReturn Duration.ofHours(1)
        }

        val sut = AuthenticationController(fakeContext, fakeUserRepo,
                fakeFormHelpers, fakeWebTokenHelper)

        sut.authenticate()
        verify(fakeUserRepo).updateLastLoggedIn("testusername")
    }

    @Test
    fun `unsuccessful authentication does not update last logged in timestamp`()
    {
        val fakeUserRepo = mock<UserRepository>()

        val fakeContext = mock<ActionContext>()
        val fakeFormHelpers = mock<FormHelpers>() {
            on {
                it.checkForm(fakeContext, mapOf("grant_type" to "client_credentials"))
            } doReturn (HTMLForm.InvalidForm(""))
        }

        val fakeWebTokenHelper = mock<WebTokenHelper>()

        val sut = AuthenticationController(fakeContext, fakeUserRepo,
                fakeFormHelpers, fakeWebTokenHelper)

        sut.authenticate()
        verify(fakeUserRepo, never()).updateLastLoggedIn(any())
    }


    @Test
    fun `cookie is Secure if allowLocalhost is false`()
    {
        val fakeContext = mock<ActionContext>(){
            on { it.username } doReturn "username"
        }

        val fakeUserRepo = mock<UserRepository>(){
            on { it.getUserByUsername("username")} doReturn fakeUser
        }

        val fakeWebTokenHelper = mock<WebTokenHelper> (){
            on { it.lifeSpan } doReturn Duration.ofHours(1)
            on {it.generateShinyToken(fakeUser)} doReturn "token"
        }

        val config = mock<ConfigWrapper>(){
            on { it.getBool("allow.localhost")} doReturn false
        }

        val sut = AuthenticationController(fakeContext, fakeUserRepo,
                mock(), fakeWebTokenHelper, config)

        sut.setShinyCookie()
        verify(fakeContext).addResponseHeader("Set-Cookie", "jwt_token=token; Path=/; Secure; HttpOnly; SameSite=Lax")
    }

    @Test
    fun `cookie is not Secure if allowLocalhost is true`()
    {
        val fakeContext = mock<ActionContext>(){
            on { it.username } doReturn "username"
        }

        val fakeUserRepo = mock<UserRepository>(){
            on { it.getUserByUsername("username")} doReturn fakeUser
        }

        val fakeWebTokenHelper = mock<WebTokenHelper> (){
            on { it.lifeSpan } doReturn Duration.ofHours(1)
            on {it.generateShinyToken(fakeUser)} doReturn "token"
        }

        val config = mock<ConfigWrapper>(){
            on { it.getBool("allow.localhost")} doReturn true
        }

        val sut = AuthenticationController(fakeContext, fakeUserRepo,
                mock(), fakeWebTokenHelper, config)

        sut.setShinyCookie()
        verify(fakeContext).addResponseHeader("Set-Cookie", "jwt_token=token; Path=/; HttpOnly; SameSite=Lax")
    }

}
