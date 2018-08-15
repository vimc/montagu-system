package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.*
import org.junit.Test
import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.WebTokenHelper
import java.time.Duration

class TokenGeneratorTests
{
    private fun tokenHelperThatCanGenerateOnetimeTokens() = mock<WebTokenHelper> {
        on { generateOnetimeActionToken(any(), any(), any(), any(), anyOrNull()) } doReturn "MY-TOKEN"
    }

    @Test
    fun `can generate onetime token from profile`()
    {
        val mockProfile = mock<CommonProfile> {
            on { attributes } doReturn mapOf("permissions" to "perm", "roles" to "roles")
            on { id } doReturn "username"
        }
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()
        val sut = OneTimeTokenGenerator(mock(), tokenHelper)
        sut.getOneTimeLinkToken("/some/url/", mockProfile)

        verify(tokenHelper).generateOnetimeActionToken("/some/url/", "username", "perm", "roles", null)
    }

    @Test
    fun `can generate onetime token from roles and permissions`()
    {
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()
        val sut = OneTimeTokenGenerator(mock(), tokenHelper)
        sut.getOneTimeLinkToken("/some/url/", listOf(ReifiedPermission("p", Scope.Global())),
                listOf(ReifiedRole("role", Scope.Global())),
                "username", Duration.ofDays(1))

        verify(tokenHelper).generateOnetimeActionToken("/some/url/", "username", "*/p", "*/role",
                Duration.ofDays(1))
    }

}