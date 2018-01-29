package org.vaccineimpact.api.validateSchema

import org.assertj.core.api.Assertions.assertThat
import org.commonmark.parser.Parser
import org.junit.Test
import org.vaccineimpact.api.test_helpers.TeamCityHelper
import java.io.StringReader

class SchemaValidator
{
    @Test
    fun run()
    {
        val allSpecFiles = ResourceHelper.getResourcesInFolder("docs/spec/", matching = Regex(".md$"))
        for (specFile in allSpecFiles)
        {
            TeamCityHelper.asSuite(specFile) {
                validateSpecFile(specFile)
            }
        }
        println("☺️\n")
    }

    private fun validateSpecFile(path: String)
    {
        println("--------------------")
        println("Checking file $path")
        val parser = Parser.builder().build()
        val spec = ResourceHelper.getResourceAsStream(path).use {
            parser.parseReader(it.reader())
        }

        val validator = JSONValidator()
        val urlRegex = buildUrlRegex()

        val endpoints = spec.children().map { Endpoint.asEndpoint(it) }.filterNotNull()
        for (endpoint in endpoints)
        {
            println("Checking $endpoint:")
            TeamCityHelper.asTest(endpoint.toString().replace(":", "")) {
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
                    println("Checking [${requestSchema.schemaPath}] against ${requestSchema.example}")
                    validator.validateExampleAgainstSchema(requestSchema.example, requestSchema.schema)
                }
            }
        }
    }

    private fun buildUrlRegex(): Regex
    {
        val lettersOrHyphen = "[a-z-]+"
        val urlChunk = """(?:$lettersOrHyphen|\{$lettersOrHyphen\})\/"""
        val queryString = """\?.+"""    // We don't check the format of the query string
        return Regex("""\/(?:$urlChunk)*(?:$queryString)?""")
    }
}