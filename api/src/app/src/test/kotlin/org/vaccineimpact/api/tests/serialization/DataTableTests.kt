package org.vaccineimpact.api.tests.serialization

import org.junit.Test
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.io.StringWriter
import org.assertj.core.api.Assertions.assertThat
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.models.TouchstoneStatus
import java.math.BigDecimal

class DataTableTests : MontaguTests()
{
    data class ABC(val a: String, val b: String, val c: String)
    data class MixedTypes(val text: String?, val int: Int?, val dec: BigDecimal?)
    data class WithEnums(val text: String, val enum: TouchstoneStatus)

    @Test
    fun `headers are written in order of constructor`()
    {
        val table = DataTable.new<ABC>(emptyList())
        assertThat(serialize(table)).isEqualTo(""""a","b","c"""")
    }

    @Test
    fun `data is written out line by line`()
    {
        val table = DataTable.new(listOf(
                ABC("g", "h", "i"),
                ABC("x", "y", "z")
        ))
        assertThat(serialize(table)).isEqualTo(""""a","b","c"
"g","h","i"
"x","y","z"""")
    }

    @Test
    fun `numbers are not quoted`()
    {
        val table = DataTable.new(listOf(
                MixedTypes("text", 123, BigDecimal("3.1415"))
        ))
        assertThat(serialize(table)).isEqualTo(""""text","int","dec"
"text",123,3.1415""")
    }

    @Test
    fun `null is converted to NA`()
    {
        val table = DataTable.new(listOf(
                MixedTypes(null, null, null)
        ))
        assertThat(serialize(table)).isEqualTo(""""text","int","dec"
NA,NA,NA""")
    }

    @Test
    fun `enum is converted to lowercase with hyphens`()
    {
        val table = DataTable.new(listOf(
                WithEnums("free text", TouchstoneStatus.IN_PREPARATION)
        ))
        assertThat(serialize(table)).isEqualTo(""""text","enum"
"free text","in-preparation"""")
    }

    private fun serialize(table: DataTable<*>) = table.serialize(Serializer.instance).trim()
}