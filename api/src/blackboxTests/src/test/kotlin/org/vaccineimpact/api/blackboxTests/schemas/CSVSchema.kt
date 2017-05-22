package org.vaccineimpact.api.blackboxTests.schemas

import org.assertj.core.api.Assertions.fail

class CSVSchema(val schemaFileName: String)
{
    fun validate(csvAsString: String)
    {
        val schemaPath = "/spec/$schemaFileName.csvschema"
        java.io.File(schemaPath).bufferedReader().use { schema ->
            java.io.StringReader(csvAsString).use { csv ->
                val messages = uk.gov.nationalarchives.csv.validator.api.java.CsvValidator.validate(csv, schema, false, emptyList(), true, true)
                if (messages.any())
                {
                    fail("CSV failed schema validation. Validating against $schemaPath.\n" +
                            "Problems: ${messages.joinToString("\n")}\n" +
                            "Full CSV text: $csvAsString")
                }
            }
        }
    }
}