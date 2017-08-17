package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import org.junit.Test
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.OneTimeLink
import org.vaccineimpact.api.app.OneTimeLinkActionContext
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.controllers.MontaguControllers
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.test_helpers.MontaguTests

class OneTimeLinkTests : MontaguTests()
{
    @Test
    fun `can parse claims to produce OneTimeLink`()
    {
        val actual = OneTimeLink.parseClaims(mapOf(
                "action" to "coverage",
                "payload" to "a=1&b=2",
                "query" to "q=3&z=4"
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
                )
        ))
    }

    @Test
    fun `return empty map of query params when query string is null`()
    {
        val actual = OneTimeLink.parseClaims(mapOf(
                "action" to "coverage",
                "payload" to "a=1&b=2",
                "query" to ""
        ))
        assertThat(actual).isEqualTo(OneTimeLink(
                action = OneTimeAction.COVERAGE,
                payload = mapOf(
                        "a" to "1",
                        "b" to "2"
                ),
                queryParams = mapOf()
        ))
    }

    @Test
    fun `perform invokes callback with OneTimeLinkActionContext`()
    {
        // Mocks
        val modelling = mock<ModellingGroupController>()
        val controllers = mock<MontaguControllers> {
            on { modellingGroup } doReturn modelling
        }
        val repos =  mock<Repositories> {
            on { modellingGroup } doReturn { mock<ModellingGroupRepository>() }
        }

        // Object under test
        val link = OneTimeLink(OneTimeAction.COVERAGE, mapOf(":key" to "value"), mapOf(":queryKey" to "queryValue"))
        link.perform(controllers, mock(), repos)

        // Expectations
        verify(modelling).getCoverageData(check {
            if (it is OneTimeLinkActionContext)
            {
                assertThat(it.params(":key")).isEqualTo("value")
            }
            else
            {
                fail("Expected $it to be ${OneTimeLinkActionContext::class.simpleName}")
            }
        }, any())
    }
}