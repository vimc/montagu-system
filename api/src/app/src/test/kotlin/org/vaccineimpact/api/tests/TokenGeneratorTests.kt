package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.*
import org.junit.Test
import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.security.UserProperties
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Duration

class TokenGeneratorTests: MontaguTests()
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
        val testUser = InternalUser(
                UserProperties("username", "name", "email", null, null),
                listOf(ReifiedRole("role", Scope.Global())),
                listOf(ReifiedPermission("p", Scope.Global())))

        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()
        val sut = OneTimeTokenGenerator(mock(), tokenHelper)

        sut.getSetPasswordToken(testUser)

        verify(tokenHelper).generateOnetimeActionToken("/v1/password/set/", "username", "*/p", "*/role",
                Duration.ofDays(1))
    }

}