package org.vaccineimpact.api.tests.security

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Before
import org.junit.Test
import org.pac4j.jwt.credentials.authenticator.JwtAuthenticator
import org.vaccineimpact.api.models.ReifiedPermission
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.UserProperties
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.LocalDate
import java.time.format.DateTimeParseException
import java.util.*

class WebTokenHelperTests : MontaguTests()
{
    lateinit var helper: WebTokenHelper

    @Before
    fun createHelper()
    {
        helper = WebTokenHelper()
    }

    @Test
    fun `can generate token`()
    {
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
        val user = User(properties, permissions)
        val token = helper.generateToken(user)

        val verifier = JwtAuthenticator(helper.signatureConfiguration)
        val claims = verifier.validateTokenAndGetClaims(token)

        assertThat(claims["iss"]).isEqualTo("vaccineimpact.org")
        assertThat(claims["sub"]).isEqualTo("test.user")
        assertThat(claims["exp"]).isInstanceOf(Date::class.java)
        assertThat(claims["permissions"]).isEqualTo("*/p1,prefix:id/p2")
    }
}