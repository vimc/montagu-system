package org.vaccineimpact.api.blackboxTests.schemas

import org.assertj.core.api.Assertions.fail
import org.vaccineimpact.api.db.getResource
import uk.gov.nationalarchives.csv.validator.api.java.CsvValidator

class CSVSchema(val schemaFileName: String)
{
    fun validate(csvAsString: String)
    {
        val schemaPath = getResource("spec/$schemaFileName.csvschema")
        schemaPath.openStream().bufferedReader().use { schema ->
            java.io.StringReader(csvAsString).use { csv ->
                val messages = CsvValidator.validate(csv, schema, false, emptyList(), true, true)
                if (messages.any())
                {
                    val messageText = messages
                            .map { it.message }
                            .joinToString("\n")

                    fail("CSV failed schema validation. Validating against $schemaPath\n" +
                            "Problems: $messageText\n" +
                            "Full CSV text: $csvAsString")
                }
            }
        }
    }
}