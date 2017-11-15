package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import org.junit.Test
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.app.OneTimeLink
import org.vaccineimpact.api.app.context.OneTimeLinkActionContext
import org.vaccineimpact.api.app.controllers.MontaguControllers
import org.vaccineimpact.api.app.controllers.PasswordController
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
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

    @Test
    fun `perform invokes callback with OneTimeLinkActionContext`()
    {
        // Mocks
        val modelling = mock<PasswordController>()
        val controllers = mock<MontaguControllers> {
            on { password } doReturn modelling
        }
        val repos =  mock<Repositories> {
            on { user } doReturn mock<UserRepository>()
        }

        // Object under test
        val link = OneTimeLink(OneTimeAction.SET_PASSWORD, mapOf(":username" to "user"), mapOf(":queryKey" to "queryValue"), "test.user")
        link.perform(controllers, mock(), repos.asFactory())

        // Expectations
        verify(modelling).setPasswordForUser(check {
            if (it is OneTimeLinkActionContext)
            {
                assertThat(it.params(":username")).isEqualTo("user")
            }
            else
            {
                fail("Expected $it to be ${OneTimeLinkActionContext::class.simpleName}")
            }
        }, any(), any())
    }
}