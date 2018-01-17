package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.OneTimeLink
import org.vaccineimpact.api.app.OnetimeLinkResolver
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.tests.mocks.asFactory

class OneTimeLinkTests : MontaguTests()
{
    @Test
    fun `can parse claims to produce OneTimeLink`()
    {
        val actual = OneTimeLink.parseClaims(mapOf(
                "action" to "coverage",
                "payload" to "a=1&b=2",
                "query" to "q=3&z=4",
                "username" to "test.user"
        ))
        assertThat(actual).isEqualTo(OneTimeLink(
                action = OneTimeAction.COVERAGE,
                payload = mapOf(
                        "a" to "1",
                        "b" to "2"
                ),
                queryParams = mapOf(
                        "q" to "3",
                        "z" to "4"
                ),
                username = "test.user"
        ))
    }

    @Test
    fun `return empty map of query params when query string is null`()
    {
        val actual = OneTimeLink.parseClaims(mapOf(
                "action" to "coverage",
                "payload" to "a=1&b=2",
                "query" to "",
                "username" to "test.user"
        ))
        assertThat(actual).isEqualTo(OneTimeLink(
                action = OneTimeAction.COVERAGE,
                payload = mapOf(
                        "a" to "1",
                        "b" to "2"
                ),
                queryParams = mapOf(),
                username = "test.user"
        ))
    }
}

class OnetimeLinkResolverTests : MontaguTests()
{

    @Test
    fun `perform invokes callback`()
    {
        // Mocks
        val userRepo = mock<UserRepository>()
        val repos = mock<Repositories> {
            on { token } doReturn mock<TokenRepository>()
            on { user } doReturn userRepo
        }
        val mockContext = mock<ActionContext>() {
            on { postData<SetPassword>() } doReturn SetPassword("password")
        }
        val mockWebTokenHelper = mock<WebTokenHelper>()

        // Object under test
        val link = OneTimeLink(OneTimeAction.SET_PASSWORD, mapOf(":username" to "user"),
                mapOf(":queryKey" to "queryValue"), "test.user")
        val sut = OnetimeLinkResolver(repos.asFactory(), mockWebTokenHelper)
        sut.perform(link, mockContext)

        // Expectations
        verify(userRepo).setPassword("user", "password")
    }
}