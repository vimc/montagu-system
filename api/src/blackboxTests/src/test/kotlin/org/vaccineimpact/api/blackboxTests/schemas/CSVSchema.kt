package org.vaccineimpact.api.blackboxTests.schemas

import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import com.opencsv.CSVReader
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import org.vaccineimpact.api.db.getResource
import java.io.StringReader

class CSVSchema(schemaFileName: String)
{
    val columns = parseSchema(schemaFileName)

    fun validate(csvAsString: String): Iterable<Array<String>>
    {
        val trimmedText = csvAsString.trim()
        if (trimmedText.startsWith("{") || trimmedText.startsWith("["))
        {
            fail("Expected CSV data, but this looks a lot like JSON: $csvAsString")
        }

        val csv = StringReader(trimmedText)
                .use { CSVReader(it).readAll() }
        val headers = csv.first()
        val body = csv.drop(1)
        assertThat(headers).containsExactlyElementsOf(columns.map { it.name })
        for ((index, row) in body.withIndex())
        {
            validate(row, index)
        }

        return body
    }

    private fun validate(row: Array<String>, rowIndex: Int)
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

    private fun parseSchema(schemaFileName: String): List<CSVColumnSpecification>
    {
        val schemaPath = getResource("spec/$schemaFileName.csvschema.json")
        val schema = Parser().parse(schemaPath.file) as JsonObject
        val columns = schema["columns"] as JsonObject
        return columns.map { (key, value) ->
            CSVColumnSpecification(key, CSVColumnType.parse(value))
        }
    }
}
