package org.vaccineimpact.api.tests.security

import com.nhaarman.mockito_kotlin.check
import com.nhaarman.mockito_kotlin.eq
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.app_start.RootTokenGenerator
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Duration

class RootTokenGeneratorTests : MontaguTests()
{
    @Test
    fun `can generate root token`()
    {
        val mock = mock<WebTokenHelper>()
        val generator = RootTokenGenerator(helper = mock)
        generator.generate(listOf("*/a", "*/b"))
        verify(mock).generateToken(
                user = check {
                    assertThat(it.properties.email).isEqualTo("montagu-help@imperial.ac.uk")
                    assertThat(it.roles).isEmpty()
                    assertThat(it.permissions).hasSameElementsAs(PermissionSet("*/a", "*/b"))
                },
                lifeSpan = eq(Duration.ofDays(365))
        )
    }
}