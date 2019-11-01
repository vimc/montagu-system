package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.verifyZeroInteractions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.addTrailingSlashes
import org.vaccineimpact.api.app.getLongCoverageRowDataTable
import org.vaccineimpact.api.app.getWideCoverageRowDataTable
import org.vaccineimpact.api.db.getResource
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.math.BigDecimal

class HelpersTests : MontaguTests()
{
    @Test
    fun `can load resource`()
    {
        val url = getResource("ExampleResource.txt")
        assertThat(url.readText()).isEqualTo("Hello world!")
    }

    @Test
    fun `addTrailingSlashes does not add slash if one already exists`()
    {
        val res = mock<spark.Response>()
        addTrailingSlashes(mockedRequest("http://example.com/"), res)
        verifyZeroInteractions(res)
    }

    @Test
    fun `addTrailingSlashes does add slash if one is missing`()
    {
        val res = mock<spark.Response>()
        addTrailingSlashes(mockedRequest("http://example.com"), res)
        verify(res).redirect("http://example.com/")
    }

    @Test
    fun `addTrailingSlashes does not tamper with query string`()
    {
        val req = mock<spark.Request> {
            on { pathInfo() } doReturn "http://example.com"
            on { queryString() } doReturn "p=1"
        }
        val res = mock<spark.Response>()
        addTrailingSlashes(req, res)
        verify(res).redirect("http://example.com/?p=1")
    }

    @Test
    fun `getWideCoverageRowDataTable can return table of NoGenderWideCoverageRows`()
    {
        val data = listOf(
                NoGenderWideCoverageRow("sid", "set1", "vax1", GAVISupportLevel.GAVI_OPTIMISTIC,
                        ActivityType.CAMPAIGN, "AAA", "country-AAA", BigDecimal(0), BigDecimal(10),
                        "0-10", mapOf("coverage_1970" to BigDecimal(0.5)))
        )
        val sequence = data.asSequence()
        val result = getWideCoverageRowDataTable(sequence, listOf())
        assertThat(result.data).isSameAs(sequence)
    }

    @Test
    fun `getWideCoverageRowDataTable can return table of GenderedWideCoverageRows`()
    {
        val data = listOf(
                GenderedWideCoverageRow("sid", "set1", "vax1", GAVISupportLevel.GAVI_OPTIMISTIC,
                        ActivityType.CAMPAIGN, "AAA", "country-AAA", BigDecimal(0), BigDecimal(10),
                        "0-10", "both", mapOf("coverage_1970" to BigDecimal(0.5)))
        )
        val sequence = data.asSequence()
        val result = getWideCoverageRowDataTable(sequence, listOf())
        assertThat(result.data).isSameAs(sequence)
    }

    @Test
    fun `getWideCoverageRowDataTable can return empty table`()
    {
        val data: List<WideCoverageRow> = listOf()
        val sequence = data.asSequence()
        val result = getWideCoverageRowDataTable(sequence, listOf())
        assertThat(result.data).isSameAs(sequence)
    }

    @Test
    fun `getLongCoverageRowDataTable can return table of NoGenderLongCoverageRows`()
    {
        val data = listOf(
                NoGenderLongCoverageRow("sid", "set1", "vax1", GAVISupportLevel.GAVI_OPTIMISTIC,
                        ActivityType.CAMPAIGN, "AAA", "country-AAA",1970, BigDecimal(0),
                        BigDecimal(10))
        )
        val sequence = data.asSequence()
        val result = getLongCoverageRowDataTable(sequence)
        assertThat(result.data).isSameAs(sequence)
    }

    @Test
    fun `getLongCoverageRowDataTable can return table of GenderedWideCoverageRows`()
    {
        val data = listOf(
                GenderedLongCoverageRow("sid", "set1", "vax1", GAVISupportLevel.GAVI_OPTIMISTIC,
                        ActivityType.CAMPAIGN, "AAA", "country-AAA", 1970, BigDecimal(0),
                        BigDecimal(10),"0-10", BigDecimal(0.9), BigDecimal(0.5), "female")
        )
        val sequence = data.asSequence()
        val result = getLongCoverageRowDataTable(sequence)
        assertThat(result.data).isSameAs(sequence)
    }

    @Test
    fun `getLongCoverageRowDataTable can return empty table`()
    {
        val data: List<LongCoverageRow> = listOf()
        val sequence = data.asSequence()
        val result = getLongCoverageRowDataTable(sequence)
        assertThat(result.data).isSameAs(sequence)
    }

    fun mockedRequest(url: String) = mock<spark.Request> {
        on { pathInfo() } doReturn url
    }
}