package org.vaccineimpact.api.tests.security

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Before
import org.junit.Test
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.*
import org.vaccineimpact.api.serialization.Serializer
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Duration
import java.time.Instant
import java.util.*
import java.util.concurrent.TimeUnit

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
        sut = WebTokenHelper(KeyHelper.keyPair, serializer = serializer)
    }

    @Test
    fun `can generate bearer token`()
    {
        val token = sut.generateToken(InternalUser(properties, roles, permissions))
        val claims = sut.verify(token.deflated(), TokenType.BEARER)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["token_type"]).isEqualTo("BEARER")
        assertThat(claims["sub"]).isEqualTo("test.user")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["roles"]).isEqualTo("*/roleA,prefix:id/roleB")
        assertThat(claims["permissions"]).isEqualTo("*/p1,prefix:id/p2")
    }

    @Test
    fun `can generate long-lived bearer token`()
    {
        val token = sut.generateToken(InternalUser(properties, roles, permissions), lifeSpan = Duration.ofDays(365))
        val claims = sut.verify(token.deflated(), TokenType.BEARER)

        assertThat(claims["exp"] as Date).isAfter(Date.from(Instant.now() + Duration.ofDays(364)))
    }

    @Test
    fun `can generate model review token for user`()
    {
        val roles = listOf(ReifiedRole("member", Scope.Specific("modelling-group", "test-group")))
        val token = sut.generateModelReviewToken(InternalUser(properties.copy(username = "some.user"),
                roles, permissions), listOf("d1"))
        val claims = sut.verify(token.deflated(), TokenType.MODEL_REVIEW)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["token_type"]).isEqualTo("MODEL_REVIEW")
        assertThat(claims["sub"]).isEqualTo("some.user")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["url"]).isEqualTo("*")
        assertThat(claims["access_level"]).isEqualTo("user")
        assertThat(claims["d1"]).isEqualTo("true")
        assertThat(claims.keys.count()).isEqualTo(7)
    }

    @Test
    fun `can generate model review token for admin`()
    {
        val token = sut.generateModelReviewToken(InternalUser(properties,
                roles + ReifiedRole("admin", Scope.Global()), permissions), listOf("d1"))
        val claims = sut.verify(token.deflated(), TokenType.MODEL_REVIEW)

        assertThat(claims["access_level"]).isEqualTo("admin")
    }

    @Test
    fun `can generate model review token for developer`()
    {
        val token = sut.generateModelReviewToken(InternalUser(properties,
                roles + ReifiedRole("developer", Scope.Global()), permissions), listOf("d1"))
        val claims = sut.verify(token.deflated(), TokenType.MODEL_REVIEW)

        assertThat(claims["access_level"]).isEqualTo("admin")
    }

    @Test
    fun `token fails validation when issuer is wrong`()
    {
        val claims = sut.claims(InternalUser(properties, roles, permissions))
        val badToken = sut.generator.generate(claims.plus("iss" to "unexpected.issuer"))
        val verifier = MontaguTokenAuthenticator(sut, TokenType.BEARER)
        assertThat(verifier.validateToken(badToken)).isNull()
        assertThatThrownBy { sut.verify(badToken.deflated(), TokenType.BEARER) }
                .isInstanceOf(TokenValidationException::class.java)
    }

    @Test
    fun `token fails validation when token type is wrong`()
    {
        val claims = sut.claims(InternalUser(properties, roles, permissions))
        val badToken = sut.generator.generate(claims.plus("token_type" to "unexpected.type"))
        val verifier = MontaguTokenAuthenticator(sut, TokenType.BEARER)
        assertThat(verifier.validateToken(badToken)).isNull()
        assertThatThrownBy { sut.verify(badToken.deflated(), TokenType.BEARER) }
                .isInstanceOf(TokenValidationException::class.java)
    }

    @Test
    fun `token fails validation when token is old`()
    {
        val claims = sut.claims(InternalUser(properties, roles, permissions))
        val badToken = sut.generator.generate(claims.plus("exp" to Date.from(Instant.now())))
        val verifier = MontaguTokenAuthenticator(sut, TokenType.BEARER)
        assertThat(verifier.validateToken(badToken)).isNull()
        assertThatThrownBy { sut.verify(badToken.deflated(), TokenType.BEARER) }
                .isInstanceOf(TokenValidationException::class.java)
    }

    @Test
    fun `token fails validation when token is signed by wrong key`()
    {
        val sauron = WebTokenHelper(KeyHelper.generateKeyPair())
        val evilToken = sauron.generateToken(InternalUser(properties, roles, permissions))
        val verifier = MontaguTokenAuthenticator(sut, TokenType.BEARER)
        assertThat(verifier.validateToken(evilToken)).isNull()
        assertThatThrownBy { sut.verify(evilToken.deflated(), TokenType.BEARER) }
                .isInstanceOf(TokenValidationException::class.java)
    }

    @Test
    fun `can generate new style onetime action token`()
    {
        val permissions = "*/can-login,modelling-group:IC-Garske/estimates.read"
        val roles = "*/user,modelling-group:IC-Garske/member"
        val mockTokenChecker = mock<OneTimeTokenChecker> {
            on { checkToken(any()) } doReturn true
        }

        val token = sut.generateOnetimeActionToken("/some/url/", "username", permissions, roles)
        val claims = sut.verifyOneTimeToken(token.deflated(), mockTokenChecker)
        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["token_type"]).isEqualTo("ONETIME")
        assertThat(claims["sub"]).isEqualTo("username")
        assertThat(claims["exp"] as Date).isAfter(Date.from(Instant.now()))
        assertThat(claims["permissions"]).isEqualTo(permissions)
        assertThat(claims["roles"]).isEqualTo(roles)
        assertThat(claims["url"]).isEqualTo("/some/url/")
        assertThat(claims["nonce"]).isNotNull()
    }

    @Test
    fun `new style onetime token fails validation when token fails onetime check`()
    {
        val mockTokenChecker = mock<OneTimeTokenChecker> {
            on { checkToken(any()) } doReturn false
        }
        val token = sut.generateOnetimeActionToken("/some/url/", "username", "", "")
        assertThatThrownBy { sut.verifyOneTimeToken(token.deflated(), mockTokenChecker) }
    }

    @Test
    fun `new style onetime token fails validation when URL is blank`()
    {
        val mockTokenChecker = mock<OneTimeTokenChecker> {
            on { checkToken(any()) } doReturn true
        }
        val token = sut.generateOnetimeActionToken("", "username", "", "")
        assertThatThrownBy { sut.verifyOneTimeToken(token.deflated(), mockTokenChecker) }
    }

    @Test
    fun `verifying a onetime token with the wrong method throws an exception`()
    {
        val token = sut.generateOnetimeActionToken("/some/url/", "username", "", "")
        assertThatThrownBy { sut.verify(token.deflated(), TokenType.ONETIME) }
                .isInstanceOf(UnsupportedOperationException::class.java)
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
        val claims = sut.verify(token.deflated(), TokenType.API_RESPONSE)

        assertThat(claims["token_type"]).isEqualTo("API_RESPONSE")
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
        val claims = sut.verify(token.deflated(), TokenType.API_RESPONSE)

        assertThat(claims["token_type"]).isEqualTo("API_RESPONSE")
        assertThat(claims["sub"]).isEqualTo("api_response")
        assertThat(claims["result"]).isEqualTo("errorResult")
    }


    @Test
    fun `can generate upload estimates token`()
    {
        val sut = WebTokenHelper(KeyHelper.generateKeyPair())
        val now = Instant.now()
        val result = sut.generateUploadEstimatesToken("user.name", "g1", "t1", "s1", 3)
        val claims = sut.verify(result, TokenType.UPLOAD)

        assertThat(claims["sub"]).isEqualTo("user.name")
        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["group-id"]).isEqualTo("g1")
        assertThat(claims["touchstone-id"]).isEqualTo("t1")
        assertThat(claims["scenario-id"]).isEqualTo("s1")
        assertThat(claims["set-id"].toString()).isEqualTo("3")
        assertThat(claims["token_type"]).isEqualTo("UPLOAD")

        val expiry = (claims["exp"] as Date)
        assertThat(expiry).isAfter(Date.from(now))
        assertThat(expiry).isBefore(Date.from(Instant.now().plus(Duration.ofDays(1))))

        val uid = claims["uid"].toString()
        val timestamp = Instant.parse(uid.split("-").takeLast(3).joinToString("-"))
        val setId = uid.split("-")[0]
        assertThat(setId).isEqualTo("3")
        assertThat(timestamp.toEpochMilli() - now.toEpochMilli()).isLessThan(TimeUnit.SECONDS.toMillis(1))
    }
}