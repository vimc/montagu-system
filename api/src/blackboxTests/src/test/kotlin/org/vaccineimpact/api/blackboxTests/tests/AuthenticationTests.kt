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
import org.vaccineimpact.api.db.direct.addDisease
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.db.direct.addModel
import org.vaccineimpact.api.db.direct.addUserForTesting
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.security.ensureUserHasRole
import org.vaccineimpact.api.security.inflated
import org.vaccineimpact.api.test_helpers.DatabaseTest

class AuthenticationTests : DatabaseTest()
{
    @Before
    fun addUser()
    {
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
    fun `can set cookies`()
    {
        JooqContext().use {
            it.addUserForTesting(TestUserHelper.username,
                    email = TestUserHelper.email, password = TestUserHelper.defaultPassword)
             it.ensureUserHasRole(TestUserHelper.username, ReifiedRole("user", Scope.Global()))
            it.ensureUserHasRole(TestUserHelper.username, ReifiedRole("member", Scope.Specific("modelling-group", "group-1")))
            it.addGroup("group-1")
            it.addDisease("d1")
            it.addModel("m1", "group-1", "d1")
        }

        val token = TokenFetcher().getToken(TestUserHelper.email, TestUserHelper.defaultPassword)
                as TokenFetcher.TokenResponse.Token

        val response = RequestHelper().get("/set-cookies/", token.token)

        assertThat(response.statusCode).isEqualTo(200)

        val mainToken = checkCookieAndGetValue(response, "montagu_jwt_token")
        val mainClaims = JWT.decode(mainToken.inflated())
        val tokenType = mainClaims.getClaim("token_type")
        assertThat(tokenType.asString()).isEqualTo("BEARER")

        val modelReviewToken = checkCookieAndGetValue(response, "jwt_token")
        val modelReviewClaims = JWT.decode(modelReviewToken)
        // this one comes from the db
        assertThat(modelReviewClaims.getClaim("d1").asString()).isEqualTo("true")
        // and this one from the model-review config
        assertThat(modelReviewClaims.getClaim("test-disease").asString()).isEqualTo("true")
    }

    @Test
    fun `can log out`()
    {
        val response = RequestHelper().get("/logout/")
        assertThat(response.statusCode).isEqualTo(200)

        val mainToken = checkCookieAndGetValue(response, "montagu_jwt_token")
        assertThat(mainToken.isEmpty()).isTrue()
        val modelReviewToken = checkCookieAndGetValue(response, "jwt_token")
        assertThat(modelReviewToken.isEmpty()).isTrue()
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
        val response = post("email@example.com", "password")
        assertDoesAuthenticate(response)
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
                    "error" to "invalid_client"
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
        val cookie = response.cookies.getCookie(key)
                ?: throw Exception("No cookie with key '$key' was found in response: ${response.text}")
        assertThat(cookie.attributes).containsKey("HttpOnly")
        assertThat(cookie.attributes["SameSite"]).isEqualTo("Strict")
        return cookie.value as String
    }

    companion object
    {
        val url = EndpointBuilder.build("/authenticate/")

        fun post(username: String, password: String, includeAuth: Boolean = true): JsonObject
        {
            val auth = if (includeAuth) BasicAuthorization(username, password) else null
            val response = post(url,
                    data = mapOf("grant_type" to "client_credentials"),
                    auth = auth
            )
            val text = response.text
            println(text)
            return Parser().parse(StringBuilder(text)) as JsonObject
        }
    }
}