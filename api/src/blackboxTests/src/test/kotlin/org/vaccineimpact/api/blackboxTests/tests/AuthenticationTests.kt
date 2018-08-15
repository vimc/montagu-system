package org.vaccineimpact.api.blackboxTests.tests

import com.auth0.jwt.JWT
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import com.beust.klaxon.json
import khttp.options
import khttp.post
import khttp.responses.Response
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
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.*
import org.vaccineimpact.api.test_helpers.DatabaseTest

data class ResponseWithJsonBody(val response: Response, val body: JsonObject)

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
            it.addUserForTesting(TestUserHelper.username,
                    email = TestUserHelper.email, password = TestUserHelper.defaultPassword)
            it.ensureUserHasRole(TestUserHelper.username, ReifiedRole("reports-reviewer", Scope.Global()))
            it.ensureUserHasRole(TestUserHelper.username, ReifiedRole("user", Scope.Global()))
        }

        val token = TokenFetcher().getToken(TestUserHelper.email, TestUserHelper.defaultPassword)
                as TokenFetcher.TokenResponse.Token

        val response = RequestHelper().get("/set-shiny-cookie/", token.token)

        assertThat(response.statusCode).isEqualTo(200)

        val shinyToken = checkCookieAndGetValue(response, "jwt_token")
        val claims = JWT.decode(shinyToken)
        val allowedShiny = claims.getClaim("allowed_shiny")
        assertThat(allowedShiny.asString()).isEqualTo("true")
    }

    @Test
    fun `can clear shiny cookie`()
    {
        val response = RequestHelper().get("/clear-shiny-cookie/")

        assertThat(response.statusCode).isEqualTo(200)

        val cookieHeader = response.headers["Set-Cookie"]!!
        assertThat(cookieHeader).contains("HttpOnly")
        assertThat(cookieHeader).contains("SameSite=Strict")

        val shinyToken = checkCookieAndGetValue(response, "jwt_token")
        assertThat(shinyToken.isEmpty()).isTrue()
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
        val (response, body) = post("email@example.com", "password")
        assertDoesAuthenticate(body)

        val token = checkCookieAndGetValue(response, "montagu_jwt_token")
        val claims = JWT.decode(token.inflated())
        val tokenType = claims.getClaim("token_type")
        assertThat(tokenType.asString()).isEqualTo("BEARER")
    }

    @Test
    fun `email authentication is not case sensitive`()
    {
        val result = post("EMAIL@example.cOm", "password")
        assertDoesAuthenticate(result.body)
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

    private fun assertDoesNotAuthenticate(response: ResponseWithJsonBody) = assertDoesNotAuthenticate(response.body)
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

    private fun checkCookieAndGetValue(response: Response, key: String): String
    {
        val cookie = response.headers["Set-Cookie"]!!
        assertThat(cookie).contains("HttpOnly")
        assertThat(cookie).contains("SameSite=Strict")
        val regex = Regex("""^$key=([^;]*);""")
        return regex.find(cookie)!!.groupValues[1]
    }

    companion object
    {
        val url = EndpointBuilder.build("/authenticate/")

        fun post(username: String, password: String, includeAuth: Boolean = true): ResponseWithJsonBody
        {
            val auth = if (includeAuth) BasicAuthorization(username, password) else null
            val response =  post(url,
                    data = mapOf("grant_type" to "client_credentials"),
                    auth = auth
            )
            val text = response.text
            println(text)
            val body = Parser().parse(StringBuilder(text)) as JsonObject
            return ResponseWithJsonBody(response, body)
        }
    }
}