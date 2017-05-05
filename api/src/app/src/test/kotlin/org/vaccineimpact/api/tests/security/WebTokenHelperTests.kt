package org.vaccineimpact.api.tests.security

import org.assertj.core.api.Assertions.assertThat
import org.junit.Before
import org.junit.Test
import org.vaccineimpact.api.models.ReifiedPermission
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.UserProperties
import org.vaccineimpact.api.security.MontaguTokenAuthenticator
import org.vaccineimpact.api.security.WebTokenHelper
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
            salt = "",
            lastLoggedIn = null
    )
    val permissions = listOf(
            ReifiedPermission("p1", Scope.Global()),
            ReifiedPermission("p2", Scope.Specific("prefix", "id"))
    )

    @Before
    fun createHelper()
    {
        helper = WebTokenHelper()
    }

    @Test
    fun `can generate token`()
    {
        val token = helper.generateToken(User(properties, permissions))

        val verifier = MontaguTokenAuthenticator(helper)
        val claims = verifier.validateTokenAndGetClaims(token)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["sub"]).isEqualTo("test.user")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["permissions"]).isEqualTo("*/p1,prefix:id/p2")
    }

    @Test
    fun `token fails validation when issuer is wrong`()
    {
        val claims = helper.claims(User(properties, permissions))
        val badToken = helper.generator.generate(claims.plus("iss" to "unexpected.issuer"))
        val verifier = MontaguTokenAuthenticator(helper)
        assertThat(verifier.validateToken(badToken)).isNull()
    }

    @Test
    fun `token fails validation when token is old`()
    {
        val claims = helper.claims(User(properties, permissions))
        val badToken = helper.generator.generate(claims.plus("exp" to Date.from(Instant.now())))
        val verifier = MontaguTokenAuthenticator(helper)
        assertThat(verifier.validateToken(badToken)).isNull()
    }

    @Test
    fun `token fails validation when token is signed by wrong key`()
    {
        val sauron = WebTokenHelper()
        val evilToken = sauron.generateToken(User(properties, permissions))
        val verifier = MontaguTokenAuthenticator(helper)
        assertThat(verifier.validateToken(evilToken)).isNull()
    }
}