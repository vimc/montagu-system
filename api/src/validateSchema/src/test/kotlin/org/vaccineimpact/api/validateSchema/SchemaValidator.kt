package org.vaccineimpact.api.validateSchema

import org.commonmark.parser.Parser
import org.junit.Test
import java.io.InputStream
import java.net.URL

class SchemaValidator
{
    @Test
    fun run()
    {
        val parser = Parser.builder().build()
        val spec = getResourceAsStream("spec/spec.md").use {
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

    companion object
    {
        private val loader = SchemaValidator::class.java.classLoader
        fun getResource(path: String): URL = loader.getResource(path)
        fun getResourceAsStream(path: String): InputStream = loader.getResourceAsStream(path)
    }
}