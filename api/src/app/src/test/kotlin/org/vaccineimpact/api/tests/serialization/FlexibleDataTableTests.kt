package org.vaccineimpact.api.tests.serialization

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.serialization.FlexibleDataTable
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.models.helpers.FlexibleProperty
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.serializeToStreamAndGetAsString

class FlexibleDataTableTests : MontaguTests()
{
    data class ABC(val a: String, val b: String, @FlexibleProperty val c: Map<String, String>)
    data class XYZ(val x: String, val y: String, val z: Map<String, String>)
    data class DEF(val d: String, val e: String, @FlexibleProperty val f: String)

    @Test
    fun `headers are written in order of constructor`()
    {
        val table = FlexibleDataTable.new<ABC>(listOf(), listOf())
        Assertions.assertThat(serialize(table)).isEqualTo("""a,b""")
    }

    @Test
    fun `throws error if no property marked as flexible`()
    {
        Assertions.assertThatThrownBy { FlexibleDataTable.new<XYZ>(listOf(), listOf()) }
                .hasMessage("No parameter marked as flexible." +
                        " Use the DataTable class to serialise data with fixed headers.")
    }

    @Test
    fun `throws error if flexible property is not a map`()
    {
        Assertions.assertThatThrownBy { FlexibleDataTable.new<DEF>(listOf(), listOf()) }
                .hasMessage("Properties marked as flexible must be of " +
                        "type Map<*, *>, where * can be whatever you like.")
    }

    @Test
    fun `extra headers are written at the end`()
    {
        val table = FlexibleDataTable.new<ABC>(listOf(), listOf("extra1", "extra2"))
        Assertions.assertThat(serialize(table)).isEqualTo("""a,b,extra1,extra2""")
    }

    @Test
    fun `data is written out line by line`()
    {
        val data = listOf(
                ABC("g", "h", mapOf("extra1" to "i", "extra2" to "j")),
                ABC("x", "y", mapOf("extra1" to "z", "extra2" to "w"))
        )
        val table = FlexibleDataTable.new<ABC>(data, listOf("extra1", "extra2"))

        Assertions.assertThat(serialize(table)).isEqualTo("""a,b,extra1,extra2
g,h,i,j
x,y,z,w""")
    }

    private fun serialize(table: FlexibleDataTable<*>) = serializeToStreamAndGetAsString {
        table.serialize(it, Serializer.instance)
    }
}