package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.OneTimeLink
import org.vaccineimpact.api.app.OnetimeLinkResolver
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.app.repositories.inmemory.InMemoryDataSet
import org.vaccineimpact.api.models.DemographicDataForTouchstone
import org.vaccineimpact.api.models.DemographicMetadata
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.TouchstoneVersion
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.serialization.DataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.tests.mocks.MockRepositories

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
    fun `perform invokes callback in transaction`()
    {
        // Mocks
        val repo = mock<TouchstoneRepository>() {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(
                    TouchstoneVersion("t1", "t", 1, "description", TouchstoneStatus.OPEN)
            ))
            on { getDemographicData(any(), any(), any(), any()) } doReturn SplitData(
                    DemographicDataForTouchstone(TouchstoneVersion("t1", "t", 1, "description", TouchstoneStatus.OPEN),
                            DemographicMetadata("1", "1", "whatever", listOf(), "", "", "")),
                    DataTable.new(sequenceOf())
            )
        }
        val innerRepos = mock<Repositories> {
            on { touchstone } doReturn repo
            on { expectations } doReturn mock<ExpectationsRepository>()
            on { modellingGroup } doReturn mock<ModellingGroupRepository>()
            on { responsibilities } doReturn mock<ResponsibilitiesRepository>()
        }
        val repos = MockRepositories(innerRepos)

        // Object under test
        val link = OneTimeLink(OneTimeAction.DEMOGRAPHY, mapOf(":touchstone-version-id" to "t1",
                ":source-code" to "s", ":type-code" to "t"),
                mapOf("format" to "long"), "test.user")
        val sut = OnetimeLinkResolver(repos, mock())
        sut.perform(link, mock())

        // Expectations
        assertThat(repos.workDoneInTransaction).isTrue()
        verify(repo).getDemographicData("t", "s", "t1")
    }
}