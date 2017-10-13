package org.vaccineimpact.api.tests.serialization

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.serialization.FlexibleDataTable
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.models.FlexibleData
import org.vaccineimpact.api.test_helpers.MontaguTests

class FlexibleDataTableTests : MontaguTests()
{
    data class ABC(val a: String, val b: String, val c: Map<String, String>)
    data class FlexibleABC(override val rows: Iterable<ABC>, override val flexibleHeaders: Iterable<String>)
        : FlexibleData<ABC>

    @Test
    fun `headers are written in order of constructor`()
    {
        val table = FlexibleDataTable.new<ABC>(FlexibleABC(listOf(), listOf()))
        Assertions.assertThat(serialize(table)).isEqualTo(""""a","b"""")
    }

    @Test
    fun `extra headers are written at the end`()
    {
        val table = FlexibleDataTable.new<ABC>(FlexibleABC(listOf(), listOf("extra1", "extra2")))
        Assertions.assertThat(serialize(table)).isEqualTo(""""a","b","extra1","extra2"""")
    }

    @Test
    fun `data is written out line by line`()
    {
        val data = listOf(
                ABC("g", "h", mapOf("extra1" to "i", "extra2" to "j")),
                ABC("x", "y", mapOf("extra1" to "z", "extra2" to "w"))
        )
        val table = FlexibleDataTable.new<ABC>(FlexibleABC(data, listOf("extra1", "extra2")))

        Assertions.assertThat(serialize(table)).isEqualTo(""""a","b","extra1","extra2"
"g","h","i","j"
"x","y","z","w"""")
    }

    private fun serialize(table: FlexibleDataTable<*>) = table.serialize(Serializer.instance).trim()

}