package org.vaccineimpact.api.tests.security

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Before
import org.junit.Test
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.security.*
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant
import java.util.*

class WebTokenHelperTests : MontaguTests()
{
    lateinit var helper: WebTokenHelper
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
    fun createHelper()
    {
        helper = WebTokenHelper(KeyHelper.keyPair)
    }

    @Test
    fun `can generate token`()
    {
        val token = helper.generateToken(MontaguUser(properties, roles, permissions))
        val claims = helper.verify(token)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["sub"]).isEqualTo("test.user")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["roles"]).isEqualTo("*/roleA,prefix:id/roleB")
        assertThat(claims["permissions"]).isEqualTo("*/p1,prefix:id/p2")
    }

    @Test
    fun `can generate onetime action token`()
    {
        val queryString = "query=answer"
        val token = helper.generateOneTimeActionToken("test-action", mapOf(
                ":a" to "1",
                ":b" to "2"
        ), queryString)
        val claims = helper.verify(token)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["sub"]).isEqualTo("onetime_link")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["action"]).isEqualTo("test-action")
        assertThat(claims["payload"]).isEqualTo(":a=1&:b=2")
        assertThat(claims["query"]).isEqualTo(queryString)
    }

    @Test
    fun `token fails validation when issuer is wrong`()
    {
        val claims = helper.claims(MontaguUser(properties, roles, permissions))
        val badToken = helper.generator.generate(claims.plus("iss" to "unexpected.issuer"))
        val verifier = MontaguTokenAuthenticator(helper)
        assertThat(verifier.validateToken(badToken)).isNull()
        assertThatThrownBy { helper.verify(badToken) }
    }

    @Test
    fun `token fails validation when token is old`()
    {
        val claims = helper.claims(MontaguUser(properties, roles, permissions))
        val badToken = helper.generator.generate(claims.plus("exp" to Date.from(Instant.now())))
        val verifier = MontaguTokenAuthenticator(helper)
        assertThat(verifier.validateToken(badToken)).isNull()
        assertThatThrownBy { helper.verify(badToken) }
    }

    @Test
    fun `token fails validation when token is signed by wrong key`()
    {
        val sauron = WebTokenHelper(KeyHelper.generateKeyPair())
        val evilToken = sauron.generateToken(MontaguUser(properties, roles, permissions))
        val verifier = MontaguTokenAuthenticator(helper)
        assertThat(verifier.validateToken(evilToken)).isNull()
        assertThatThrownBy { helper.verify(evilToken) }
    }
}