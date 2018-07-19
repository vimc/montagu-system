package org.vaccineimpact.api.tests.serialization

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.serialization.EmptyDataTable

class EmptyDataTableTests : FlexibleDataTableTests()
{

    @Test
    fun `data has correct number of rows`()
    {
        val table = EmptyDataTable.new<BurdenEstimate>(10, listOf("flexheader"))
        assertThat(table.data.count()).isEqualTo(10)
    }

    @Test
    fun `all rows are empty`()
    {
        val table = EmptyDataTable.new<BurdenEstimate>(5, listOf("flexheader"))
        assertThat(table.data.count()).isEqualTo(5)
        assertThat(serialize(table)).isEqualTo("""disease,year,age,country,country_name,cohort_size,flexheader
,,,,,
,,,,,
,,,,,
,,,,,
,,,,,""")
    }

}