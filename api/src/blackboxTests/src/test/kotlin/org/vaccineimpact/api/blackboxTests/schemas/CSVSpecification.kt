package org.vaccineimpact.api.blackboxTests.schemas

import com.opencsv.CSVReader
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import java.io.StringReader

open class CSVSpecification(protected val columns: List<CSVColumnSpecification>)
{
    fun validateRow(csvAsString: String): Iterable<Array<String>>
    {
        val trimmedText = csvAsString.trim()
        if (trimmedText.startsWith("{") || trimmedText.startsWith("["))
        {
            fail("Expected CSV data, but this looks a lot like JSON: $csvAsString")
        }

        val csv = StringReader(trimmedText)
                .use { CSVReader(it).readAll() }
        val headers = processRow(csv.first())
        val body = csv.drop(1)

        assertThat(headers).containsExactlyElementsOf(columns.map { it.name })

        for ((index, row) in body.withIndex())
        {
            validateRow(processRow(row), index)
        }

        return body
    }

    private fun validateRow(row: List<String>, rowIndex: Int)
    {
        if (row.size != columns.size)
        {
            fail("Row $rowIndex had the wrong number of columns. It had ${row.size}, but we expected ${columns.size}")
        }
        for ((spec, actual) in columns.zip(row))
        {
            spec.assertMatches(actual, rowIndex)
        }
    }

    protected open fun processRow(row: Array<String>): List<String>
    {
        return row.toList()
    }
}

class FlexibleCSVSpecification(minimumColumns: List<CSVColumnSpecification>): CSVSpecification(minimumColumns)
{
    override fun processRow(row: Array<String>): List<String>
    {
        // We don't care what happens after the specified columns - those can be anything
        return row.take(columns.size)
    }
}