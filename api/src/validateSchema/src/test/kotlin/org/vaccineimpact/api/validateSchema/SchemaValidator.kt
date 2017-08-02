package org.vaccineimpact.api.validateSchema

import org.commonmark.parser.Parser
import org.junit.Test

class SchemaValidator
{
    @Test
    fun run()
    {
        val parser = Parser.builder().build()
        val spec = ResourceHelper.getResourceAsStream("spec/spec.md").use {
            parser.parseReader(it.reader())
        }

        val validator = JSONValidator()
        val endpoints = spec.children().map { Endpoint.asEndpoint(it) }.filterNotNull()
        for (endpoint in endpoints)
        {
            println("Checking $endpoint:")
            for (requestSchema in endpoint.requestSchemas)
            {
                println("- Checking [${requestSchema.schemaPath}] against ${requestSchema.example}")
                validator.validateExampleAgainstSchema(requestSchema.example, requestSchema.schema)
            }
        }
    }
}