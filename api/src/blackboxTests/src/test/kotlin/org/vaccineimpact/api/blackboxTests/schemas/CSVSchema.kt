package org.vaccineimpact.api.blackboxTests.schemas

import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import org.vaccineimpact.api.db.getResource
import org.vaccineimpact.api.validateSchema.Validator

class CSVSchema(schemaFileName: String) : Schema
{
    private val specification: CSVSpecification = parseSchema(schemaFileName)

    override val validator: Validator
        get() = throw Exception("Only JSON responses can communicate errors")

    override fun validateRequest(request: String)
    {
        specification.validateRow(request)
    }
    override fun validateResponse(response: String, contentType: String?)
    {
        specification.validateRow(response)
    }

    fun validate(csvAsString: String) = specification.validateRow(csvAsString)

    private fun parseSchema(schemaFileName: String): CSVSpecification
    {
        val schemaPath = getResource("docs/schemas/$schemaFileName.csvschema.json")
        val schema = Parser().parse(schemaPath.file) as JsonObject
        val columns = (schema["columns"] as JsonObject).map { (key, value) ->
            CSVColumnSpecification(key, CSVColumnType.parse(value))
        }
        val additionalColumnsAllowed = schema.getValue("additionalColumnsAllowed", default = false)
        return if (additionalColumnsAllowed)
        {
            FlexibleCSVSpecification(columns)
        }
        else
        {
            CSVSpecification(columns)
        }
    }

    private inline fun <reified T> JsonObject.getValue(key: String, default: T? = null): T
    {
        if (key in this)
        {
            val value = this[key]
            if (value is T)
            {
                return value
            }
            else
            {
                throw Exception("Unable to parse value '$value' for key '$key' as '${T::class.simpleName}'")
            }
        }
        else if (default != null)
        {
            return default
        }
        else
        {
            throw Exception("No value found for mandatory key '$key'")
        }
    }
}
