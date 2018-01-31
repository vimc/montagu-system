package org.vaccineimpact.api.db

import java.io.Closeable
import java.io.Flushable
import java.io.OutputStream
import java.io.Writer

/**
 * At present this class only writes out using the TEXT format (as opposed to CSV and BINARY).
 * See the Postgres COPY documentation for more info.
 * https://www.postgresql.org/docs/current/static/sql-copy.html
 */
class PostgresCopyWriter(private val wrapped: Writer) : Flushable by wrapped, Closeable by wrapped
{
    constructor(stream: OutputStream)
            : this(stream.writer())

    // From the documentation: "In particular, the following characters must be preceded by a backslash
    // if they appear as part of a column value: backslash itself, newline, carriage return, and the current
    // delimiter character."
    private val illegalCharacters = Regex("""\\|\n|\r|\t""")

    fun writeRow(values: Iterable<Any?>)
    {
        writeln(values.joinToString("\t", transform = this::escape))
    }

    private fun writeln(text: String)
    {
        wrapped.write("$text\n")
    }

    private fun escape(value: Any?): String
    {
        return if (value == null)
        {
            """\N"""
        }
        else
        {
            value.toString().replace(illegalCharacters) { "\\" + it.value }
        }
    }

    override fun close()
    {
        writeln("""\.""")
        wrapped.close()
    }
}