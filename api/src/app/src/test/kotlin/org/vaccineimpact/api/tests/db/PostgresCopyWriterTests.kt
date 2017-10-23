package org.vaccineimpact.api.tests.db

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.PostgresCopyWriter
import org.vaccineimpact.api.test_helpers.serializeToStreamAndGetAsString
import java.math.BigDecimal

class PostgresCopyWriterTests
{
    val backslash = """\"""

    @Test
    fun `backslashes are escaped`()
    {
        assertThat(write(backslash)).isEqualTo(backslash + backslash)
    }

    @Test
    fun `newlines are escaped`()
    {
        assertThat(write("\n")).isEqualTo(backslash + "\n")
    }

    @Test
    fun `carriage returns are escaped`()
    {
        assertThat(write("\r")).isEqualTo(backslash + "\r")
    }

    @Test
    fun `tabs are escaped`()
    {
        assertThat(write("\t")).isEqualTo(backslash + "\t")
    }

    @Test
    fun `null is written`()
    {
        assertThat(write(null)).isEqualTo("""\N""")
    }

    @Test
    fun `can write out complete line`()
    {
        val line = write(listOf("a", "b\tc", 1, BigDecimal(5.25)))
        assertThat(line.replace("\t", "---"))
                .isEqualTo("""a---b\---c---1---5.25""")
    }

    @Test
    fun `copy is terminated with full stop`()
    {
        val text = serializeToStreamAndGetAsString { stream ->
            PostgresCopyWriter(stream).use {
                it.writeRecord(listOf(1, 2, 3))
            }
        }.replace("\t", "---")
        assertThat(text).isEqualTo("""1---2---3
\.
""")
    }

    private fun write(value: Any?) = write(listOf(value))
    private fun write(values: Iterable<Any?>) = serializeToStreamAndGetAsString { stream ->
        PostgresCopyWriter(stream).run {
            writeRecord(values)
            flush()
        }
    }.dropLast(1)   // Strip off the new line added by writeln
}