package org.vaccineimpact.api.blackboxTests.tests

import com.auth0.jwt.JWT
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import com.beust.klaxon.json
import khttp.options
import khttp.post
import khttp.structures.authorization.BasicAuthorization
import org.assertj.core.api.Assertions.assertThat
import org.junit.Before
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.EndpointBuilder
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.TokenFetcher
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.APP_USER
import org.vaccineimpact.api.db.direct.addUserForTesting
import org.vaccineimpact.api.db.direct.addUserWithRoles
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.security.createRole
import org.vaccineimpact.api.security.ensureUserHasRole
import org.vaccineimpact.api.security.setRolePermissions
import org.vaccineimpact.api.test_helpers.DatabaseTest

class AuthenticationTests : DatabaseTest()
{
    @Before
    fun addUser()
    {
        //CertificateHelper.disableCertificateValidation()
        JooqContext().use {
            UserHelper.saveUser(it.dsl, "user", "Full Name", "email@example.com", "password")
        }
    }

    @Test
    fun `authentication fails without BasicAuth header`()
    {
        val result = post("email@example.com", "password", includeAuth = false)
        assertDoesNotAuthenticate(result)
    }

    @Test
    fun `can set shiny cookie`()
    {
        JooqContext().use {
            val roleId = it.createRole("report.reviewer", null, "")
            it.setRolePermissions(roleId, listOf("can-login"))
            it.addUserForTesting(TestUserHelper.username,
                    email = TestUserHelper.email, password = TestUserHelper.defaultPassword)
            it.ensureUserHasRole(TestUserHelper.username, ReifiedRole("report.reviewer", Scope.Global()))
        }

        val token = TokenFetcher().getToken(TestUserHelper.email, TestUserHelper.defaultPassword)
                as TokenFetcher.TokenResponse.Token

        val response = RequestHelper().get("/set-shiny-cookie/", token.token)

        assertThat(response.statusCode).isEqualTo(200)

        val cookie = response.headers["Set-Cookie"]!!
        assertThat(cookie).contains("Secure")
        assertThat(cookie).contains("HttpOnly")
        assertThat(cookie).contains("SameSite=Lax")

        val shinyToken = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
        val claims = JWT.decode(shinyToken)
        val allowedShiny = claims.getClaim("allowed_shiny")
        assertThat(allowedShiny.asBoolean()).isTrue()
    }

    @Test
    fun `unknown email does not authenticate`()
    {
        val result = post("bad@example.com", "password")
        assertDoesNotAuthenticate(result)
    }

    @Test
    fun `incorrect password does not authenticate`()
    {
        val result = post("email@example.com", "bad_password")
        assertDoesNotAuthenticate(result)
    }

    @Test
    fun `cannot login if use does not have password`()
    {
        JooqContext().use {
            it.dsl.update(APP_USER).set(mapOf(APP_USER.PASSWORD_HASH to null)).execute()
        }
        assertDoesNotAuthenticate(post("email@example.com", ""))
        assertDoesNotAuthenticate(post("email@example.com", "password"))
    }

    @Test
    fun `cannot authenticate with username`()
    {
        val result = post("user", "password")
        assertDoesNotAuthenticate(result)
    }

    @Test
    fun `correct password does authenticate`()
    {
        val result = post("email@example.com", "password")
        assertDoesAuthenticate(result)
    }

    @Test
    fun `email authentication is not case sensitive`()
    {
        val result = post("EMAIL@example.cOm", "password")
        assertDoesAuthenticate(result)
    }

    @Test
    fun `can get OPTIONS for authentication endpoint`()
    {
        val result = options(url)
        assertThat(result.statusCode).isEqualTo(200)
    }

    private fun assertDoesAuthenticate(result: JsonObject)
    {
        assertThat(result).doesNotContainKey("error")
        assertThat(result).containsKey("access_token")
        assertThat(result["token_type"]).isEqualTo("bearer")
        assertThat(isLong(result["expires_in"].toString()))
    }

    private fun assertDoesNotAuthenticate(result: JsonObject)
    {
        assertThat(result).isEqualTo(json {
            obj(
                    "error" to "Bad credentials"
            )
        })
    }

    private fun isLong(raw: String): Boolean
    {
        try
        {
            raw.toLong()
            return true
        }
        catch (e: NumberFormatException)
        {
            return false
        }
    }

    companion object
    {
        val url = EndpointBuilder.build("/authenticate/")

        fun post(username: String, password: String, includeAuth: Boolean = true): JsonObject
        {
            val auth = if (includeAuth) BasicAuthorization(username, password) else null
            val text = post(url,
                    data = mapOf("grant_type" to "client_credentials"),
                    auth = auth).text
            println(text)
            return Parser().parse(StringBuilder(text)) as JsonObject
        }
    }
}