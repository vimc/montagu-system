package org.vaccineimpact.api.tests.security

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.junit.Test
import org.pac4j.core.authorization.authorizer.AbstractRequireElementAuthorizer
import org.pac4j.core.client.DirectClient
import org.vaccineimpact.api.app.security.*
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests

class TokenVerifyingConfigFactoryTests : MontaguTests()
{

    @Test
    fun `builds expected config`()
    {
        val requiredPermission = PermissionRequirement.parse("*/testperm")

        val sut = TokenVerifyingConfigFactory(WebTokenHelper(KeyHelper.generateKeyPair()), setOf(requiredPermission), mock())

        val result = sut.build()

        assertThat(result.clients.clients.count()).isEqualTo(3)
        assertThat(result.clients.clients.first().name).isEqualTo("CompressedJWTHeaderClient")
        assertThat(result.clients.clients[1].name).isEqualTo("CompressedJWTCookieClient")
        assertThat(result.clients.clients.last().name).isEqualTo("CompressedJWTParameterClient")

        assertThat(result.clients.clients.all {
            (it as DirectClient)
                    .authorizationGenerators.count() == 1
        }).isTrue()
        assertThat(result.clients.clients.all {
            (it as DirectClient)
                    .authorizationGenerators.first() is MontaguAuthorizationGenerator
        }).isTrue()

        assertThat(result.httpActionAdapter is TokenActionAdapter).isTrue()

        assertThat(result.authorizers.count()).isEqualTo(1)
        assertThat(result.authorizers.entries.first().key).isEqualTo("MontaguAuthorizer")

        val authorizer = result.authorizers.entries.first().value
        assertThat(authorizer is MontaguAuthorizer).isTrue()
        val baseClass = AbstractRequireElementAuthorizer::class.java
        val field = baseClass.getDeclaredField("elements")
        field.isAccessible = true
        val authElements = field.get(authorizer)

        assertThat(authElements is Set<*>).isTrue()
        assertThat((authElements as Set<*>).count()).isEqualTo(1)
        assertThat(authElements.first()).isEqualTo(requiredPermission)
    }
}