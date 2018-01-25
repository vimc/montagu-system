package org.vaccineimpact.api.validateSchema

import org.assertj.core.api.Assertions.assertThat
import org.commonmark.parser.Parser
import org.junit.Test
import java.io.StringReader

class SchemaValidator
{
    @Test
    fun run()
    {
        val parser = Parser.builder().build()
        val allSpecFiles = ResourceHelper.getResourcesInFolder("docs/spec/", matching = Regex(".md$"))
        val fullText = allSpecFiles.joinToString("") {
            ResourceHelper.getResourceAsStream(it).reader().readText()
        }

        val spec = StringReader(fullText).use {
            parser.parseReader(it)
        }

        val validator = JSONValidator()
        val urlRegex = buildUrlRegex()

        val endpoints = spec.children().map { Endpoint.asEndpoint(it) }.filterNotNull()
        for (endpoint in endpoints)
        {
            println("Checking $endpoint:")

            if (!endpoint.isMetaBlock)
            {
                assertThat(urlRegex.matches(endpoint.urlTemplate))
                        .`as`("'${endpoint.urlTemplate}' did not match expected regex. URL must consist only of " +
                                "letters, hyphens, and slashes, and must begin and end with a slash. Full " +
                                "regex: $urlRegex  ")
                        .isTrue()
            }
            for (requestSchema in endpoint.requestSchemas)
            {
                println("- Checking [${requestSchema.schemaPath}] against ${requestSchema.example}")
                validator.validateExampleAgainstSchema(requestSchema.example, requestSchema.schema)
            }
        }
        println("☺️\n")
    }

    private fun buildUrlRegex(): Regex
    {
        val lettersOrHyphen = "[a-z-]+"
        val urlChunk = """(?:$lettersOrHyphen|\{$lettersOrHyphen\})\/"""
        val queryString = """\?.+"""    // We don't check the format of the query string
        return Regex("""\/(?:$urlChunk)*(?:$queryString)?""")
    }
}