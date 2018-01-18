package org.vaccineimpact.api.tests.security

import com.nhaarman.mockito_kotlin.argThat
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Before
import org.junit.Test
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.*
import org.vaccineimpact.api.serialization.Serializer
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant
import java.util.*

class WebTokenHelperTests : MontaguTests()
{
    lateinit var sut: WebTokenHelper
    val properties = UserProperties(
            username = "test.user",
            name = "Test User",
            email = "test@example.com",
            passwordHash = "",
            lastLoggedIn = null
    )
    val roles = listOf(
            ReifiedRole("roleA", Scope.Global()),
            ReifiedRole("roleB", Scope.Specific("prefix", "id"))
    )
    val permissions = listOf(
            ReifiedPermission("p1", Scope.Global()),
            ReifiedPermission("p2", Scope.Specific("prefix", "id"))
    )

    @Before
    fun setUp()
    {
        createHelper()
    }

    private fun createHelper(serializer: Serializer = mock<Serializer>())
    {
        sut = WebTokenHelper(KeyHelper.keyPair, serializer)
    }

    @Test
    fun `can generate token`()
    {
        val token = sut.generateToken(InternalUser(properties, roles, permissions))
        val claims = sut.verify(token)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["sub"]).isEqualTo("test.user")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["roles"]).isEqualTo("*/roleA,prefix:id/roleB")
        assertThat(claims["permissions"]).isEqualTo("*/p1,prefix:id/p2")
    }

    @Test
    fun `can generate shiny token for non report reviewer`()
    {
        val token = sut.generateShinyToken(InternalUser(properties, roles, permissions))
        val claims = sut.verify(token)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["sub"]).isEqualTo("test.user")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["allowed_shiny"]).isEqualTo(false)
    }

    @Test
    fun `can generate shiny token for report reviewer`()
    {
        val roles = listOf(
                ReifiedRole("report.reviewer", Scope.Global())
        )
        val token = sut.generateShinyToken(InternalUser(properties, roles, permissions))
        val claims = sut.verify(token)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["sub"]).isEqualTo("test.user")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["allowed_shiny"]).isEqualTo(true)
    }

    @Test
    fun `can generate onetime action token`()
    {
        val queryString = "query=answer"
        val token = sut.generateOneTimeActionToken("test-action", mapOf(
                ":a" to "1",
                ":b" to "2"
        ), queryString, WebTokenHelper.oneTimeLinkLifeSpan, "test.user")
        val claims = sut.verify(token)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["sub"]).isEqualTo("onetime_link")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["action"]).isEqualTo("test-action")
        assertThat(claims["payload"]).isEqualTo(":a=1&:b=2")
        assertThat(claims["query"]).isEqualTo(queryString)
        assertThat(claims["username"]).isEqualTo("test.user")
    }

    @Test
    fun `can generate onetime action token with null query string`()
    {
        val token = sut.generateOneTimeActionToken("test-action", mapOf(
                ":a" to "1",
                ":b" to "2"
        ), null, WebTokenHelper.oneTimeLinkLifeSpan, "test.user")
        val claims = sut.verify(token)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["sub"]).isEqualTo("onetime_link")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["action"]).isEqualTo("test-action")
        assertThat(claims["payload"]).isEqualTo(":a=1&:b=2")
        assertThat(claims["query"]).isNull()
        assertThat(claims["username"]).isEqualTo("test.user")
    }

    @Test
    fun `token fails validation when issuer is wrong`()
    {
        val claims = sut.claims(InternalUser(properties, roles, permissions))
        val badToken = sut.generator.generate(claims.plus("iss" to "unexpected.issuer"))
        val verifier = MontaguTokenAuthenticator(sut)
        assertThat(verifier.validateToken(badToken)).isNull()
        assertThatThrownBy { sut.verify(badToken) }
    }

    @Test
    fun `token fails validation when token is old`()
    {
        val claims = sut.claims(InternalUser(properties, roles, permissions))
        val badToken = sut.generator.generate(claims.plus("exp" to Date.from(Instant.now())))
        val verifier = MontaguTokenAuthenticator(sut)
        assertThat(verifier.validateToken(badToken)).isNull()
        assertThatThrownBy { sut.verify(badToken) }
    }

    @Test
    fun `token fails validation when token is signed by wrong key`()
    {
        val sauron = WebTokenHelper(KeyHelper.generateKeyPair())
        val evilToken = sauron.generateToken(InternalUser(properties, roles, permissions))
        val verifier = MontaguTokenAuthenticator(sut)
        assertThat(verifier.validateToken(evilToken)).isNull()
        assertThatThrownBy { sut.verify(evilToken) }
    }

    @Test
    fun `can encode result token`()
    {
        val serializer = mock<Serializer> {
            on { toJson(argThat { status == ResultStatus.SUCCESS }) } doReturn "successResult"
        }

        createHelper(serializer)
        val result = Result(ResultStatus.SUCCESS, "OK", listOf())
        val token = sut.encodeResult(result)
        val claims = sut.verify(token)

        assertThat(claims["sub"]).isEqualTo("api_response")
        assertThat(claims["result"]).isEqualTo("successResult")

    }

    @Test
    fun `can encode error result token`()
    {
        val serializer = mock<Serializer> {
            on { toJson(argThat { status == ResultStatus.FAILURE }) } doReturn "errorResult"
        }

        createHelper(serializer)
        val result = Result(ResultStatus.FAILURE, null,
                listOf(ErrorInfo("some-code", "some message")))
        val token = sut.encodeResult(result)
        val claims = sut.verify(token)

        assertThat(claims["sub"]).isEqualTo("api_response")
        assertThat(claims["result"]).isEqualTo("errorResult")
    }
}