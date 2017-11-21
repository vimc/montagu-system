package org.vaccineimpact.api.tests.serialization

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.models.ModelRun
import org.vaccineimpact.api.serialization.DataTableDeserializer
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.helpers.FlexibleColumns
import org.vaccineimpact.api.serialization.DataTable
import org.vaccineimpact.api.serialization.validation.ValidationException
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.serializeToStreamAndGetAsString
import java.math.BigDecimal

class DataTableTests : MontaguTests()
{
    data class ABC(val a: String, val b: String, val c: String)
    data class MixedTypes(val text: String?, val int: Int?, val dec: BigDecimal?)
    data class WithEnums(val text: String, val enum: TouchstoneStatus)
    @FlexibleColumns
    data class Flexible(val a: Int, val b: String, val extra: Map<String, Int>)

    @Test
    fun `headers are written in order of constructor`()
    {
        val table = DataTable.new<ABC>(emptySequence())
        assertThat(serialize(table)).isEqualTo("""a,b,c""")
    }

    @Test
    fun `data is written out line by line`()
    {
        val table = DataTable.new(sequenceOf(
                ABC("g", "h", "i"),
                ABC("x", "y", "z")
        ))
        assertThat(serialize(table)).isEqualTo("""a,b,c
g,h,i
x,y,z""")
    }

    @Test
    fun `special characters are escaped`()
    {
        val table = DataTable.new(sequenceOf(
                ABC("g", "h", "i"),
                ABC("x", "y", "z"),
                ABC("with, commas", """with "quotes" and no commas""", """both "quotes" and ,commas,""")
        ))
        assertThat(serialize(table)).isEqualTo("""a,b,c
g,h,i
x,y,z
"with, commas","with ""quotes"" and no commas","both ""quotes"" and ,commas,"""")
    }

    @Test
    fun `mixed types are written out`()
    {
        val table = DataTable.new(sequenceOf(
                MixedTypes("text", 123, BigDecimal("3.1415"))
        ))
        assertThat(serialize(table)).isEqualTo("""text,int,dec
text,123,3.1415""")
    }

    @Test
    fun `null is converted to NA`()
    {
        val table = DataTable.new(sequenceOf(
                MixedTypes(null, null, null)
        ))
        assertThat(serialize(table)).isEqualTo("""text,int,dec
<NA>,<NA>,<NA>""")
    }

    @Test
    fun `enum is converted to lowercase with hyphens`()
    {
        val table = DataTable.new(sequenceOf(
                WithEnums("free text", TouchstoneStatus.IN_PREPARATION)
        ))
        assertThat(serialize(table)).isEqualTo("""text,enum
free text,in-preparation""")
    }


    @Test
    fun `can deserialize CSV`()
    {
        val csv = """
            text,int,dec
            "joe",1,6.53
            "bob",2,2.0"""
        val rows = DataTableDeserializer.deserialize(csv, MixedTypes::class, MontaguSerializer.instance).toList()
        assertThat(rows).containsExactlyElementsOf(listOf(
                MixedTypes("joe", 1, BigDecimal.valueOf(6.53)),
                MixedTypes("bob", 2, BigDecimal.valueOf(2.0))
        ))
    }

    @Test
    fun `csv headers are case insensitive`()
    {
        val csv = """
            Text,Int,dec
            "joe",1,6.53
            "bob",2,2.0"""
        val rows = DataTableDeserializer.deserialize(csv, MixedTypes::class, MontaguSerializer.instance).toList()
        assertThat(rows).containsExactlyElementsOf(listOf(
                MixedTypes("joe", 1, BigDecimal.valueOf(6.53)),
                MixedTypes("bob", 2, BigDecimal.valueOf(2.0))
        ))
    }

    @Test
    fun `error if headers do not match expected`()
    {
        val csv = """
            a,b,c,d
            1,2,3,4"""
        checkValidationError("csv-unexpected-header") {
            DataTableDeserializer.deserialize(csv, ABC::class, MontaguSerializer.instance).toList()
        }
    }

    @Test
    fun `error if row has too many columns`()
    {
        val csv = """
            a,b,c
            1,2,3
            1,2,3,4"""
        checkValidationError("csv-wrong-row-length:2") {
            DataTableDeserializer.deserialize(csv, ABC::class, MontaguSerializer.instance).toList()
        }
    }

    @Test
    fun `error if row has too few columns`()
    {
        val csv = """
            a,b,c
            1,2,3
            1,2"""
        checkValidationError("csv-wrong-row-length:2") {
            DataTableDeserializer.deserialize(csv, ABC::class, MontaguSerializer.instance).toList()
        }
    }

    @Test
    fun `error if row value in wrong data type`()
    {
        val csv = """
            text,int,dec
            "joe",1,3.14
            "sam",2.6,1"""
        checkValidationError("csv-bad-data-type:2:int", "Unable to parse '2.6' as Int? (Row 2, column int)") {
            DataTableDeserializer.deserialize(csv, MixedTypes::class, MontaguSerializer.instance).toList()
        }
    }

    @Test
    fun `can deserialize CSV with flexible headers`()
    {
        val csv = """
            a,b,x,y,z
            1,"joe",1,2,3
            2,"bob",4,5,6"""
        val rows = DataTableDeserializer.deserialize(csv, Flexible::class, MontaguSerializer.instance).toList()
        assertThat(rows).containsExactlyElementsOf(listOf(
                Flexible(1, "joe", mapOf("x" to 1, "y" to 2, "z" to 3)),
                Flexible(2, "bob", mapOf("x" to 4, "y" to 5, "z" to 6))
        ))
    }

    @Test
    fun `error if flexible CSV has missing required headers`()
    {
        val csv = """
            a,x,y
            1,2,3
            3,4,5"""
        checkValidationError("csv-unexpected-header") {
            DataTableDeserializer.deserialize(csv, Flexible::class, MontaguSerializer.instance).toList()
        }
    }

    @Test
    fun `error if row in flexible CSV has too few values`()
    {
        val csv = """
            a,  b,x,y,z
            0,"p",1,2,3
            0,"q",1,2"""
        checkValidationError("csv-wrong-row-length:2") {
            DataTableDeserializer.deserialize(csv, Flexible::class, MontaguSerializer.instance).toList()
        }
    }

    @Test
    fun `error if row in flexible CSV has too many values`()
    {
        val csv = """
            a,  b,x,y,z
            0,"p",1,2,3
            0,"q",1,2,3,4"""
        checkValidationError("csv-wrong-row-length:2") {
            DataTableDeserializer.deserialize(csv, Flexible::class, MontaguSerializer.instance).toList()
        }
    }

    @Test
    fun `error if extra value in flexible CSV has wrong data type`()
    {
        val csv = """
            a,  b,x,y,z
            0,"p",1,2,3
            0,"q",1,2,3.5"""
        checkValidationError("csv-bad-data-type:2:z") {
            DataTableDeserializer.deserialize(csv, Flexible::class, MontaguSerializer.instance).toList()
        }
    }

    @Test
    fun `error if empty values when all columns required`()
    {
        val csv = """
            run_id,p1,p2,p3
            1,14,15.2,4
            2,14,15.3,"""
        checkValidationError("csv-missing-data:2:p3") {
            DataTableDeserializer.deserialize(csv, ModelRun::class, MontaguSerializer.instance).toList()
        }
    }

    private fun serialize(table: DataTable<*>) = serializeToStreamAndGetAsString {
        table.serialize(it, MontaguSerializer.instance)
    }.trim()

    private fun checkValidationError(code: String, message: String? = null, body: () -> Any?)
    {
        assertThatThrownBy { body() }
                .isInstanceOf(ValidationException::class.java)
                .matches {
                    val error = it as ValidationException
                    assertThat(error.errors.first().code).isEqualTo(code)
                    if (message != null)
                    {
                        assertThat(error.errors.first().message).isEqualTo(message)
                    }
                    true
                }
    }
}