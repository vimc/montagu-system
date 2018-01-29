package org.vaccineimpact.api.validateSchema

import com.fasterxml.jackson.core.JsonParseException
import com.fasterxml.jackson.databind.JsonNode
import com.github.fge.jackson.JsonLoader
import com.github.fge.jsonschema.core.load.configuration.LoadingConfiguration
import com.github.fge.jsonschema.core.load.uri.URITranslatorConfiguration
import com.github.fge.jsonschema.main.JsonSchemaFactory
import org.assertj.core.api.Assertions

class JSONValidator : Validator
{
    private val schemaFactory = makeSchemaFactory()
    private val responseSchema = readSchema("Response")

    fun validateAgainstSchema(text: String, schemaName: String,
                              wrappedInStandardResponseSchema: Boolean = true)
    {
        val json = parseJson(text, "request/response")
        val data = if (wrappedInStandardResponseSchema)
        {
            checkResultSchema(json, text, "success")
            // The part to verify against schemaName is the data part of the standard response schema
            json["data"]
        }
        else
        {
            json
        }
        val schema = readSchema(schemaName)
        assertValidates(schema, data)
    }

    fun validateExampleAgainstSchema(example: String, schemaAsString: String)
    {
        val json = parseJson(example, "example")
        val schema = JsonLoader.fromString(schemaAsString)
        assertValidates(schema, json)
    }

    override fun validateError(response: String,
                               expectedErrorCode: String?,
                               expectedErrorText: String?,
                               assertionText: String?)
    {
        val json = parseJson(response, "response")
        checkResultSchema(json, response, "failure", assertionText = assertionText)
        val error = json["errors"].first()
        if (expectedErrorCode != null)
        {
            Assertions.assertThat(error["code"].asText())
                    .withFailMessage("Expected error code to be '$expectedErrorCode' in $response")
                    .isEqualTo(expectedErrorCode)
        }
        if (expectedErrorText != null)
        {
            Assertions.assertThat(error["message"].asText()).contains(expectedErrorText)
        }
    }

    override fun validateSuccess(response: String, assertionText: String?)
    {
        val json = parseJson(response, "response")
        checkResultSchema(json, response, "success", assertionText = assertionText)
    }

    private fun checkResultSchema(json: JsonNode, jsonAsString: String, expectedStatus: String, assertionText: String? = null)
    {
        @Suppress("NAME_SHADOWING")
        val assertionText = assertionText ?: "Check that the response has status '$expectedStatus'"
        assertValidates(responseSchema, json)
        val status = json["status"].textValue()
        Assertions.assertThat(status)
                .`as`("$assertionText in $jsonAsString")
                .isEqualTo(expectedStatus)
    }

    private fun readSchema(name: String): JsonNode = JsonLoader.fromResource("/docs/schemas/$name.schema.json")

    private fun assertValidates(schema: JsonNode, json: JsonNode)
    {
        val report = schemaFactory.getJsonSchema(schema).validate(json)
        if (!report.isSuccess)
        {
            Assertions.fail("JSON failed schema validation. Attempted to validate: $json against $schema. Report follows: $report")
        }
    }

    private fun makeSchemaFactory(): JsonSchemaFactory
    {
        val namespace = "resource:/docs/schemas/"
        val uriTranslatorConfig = URITranslatorConfiguration
                .newBuilder()
                .setNamespace(namespace)
                .freeze()
        val loadingConfig = LoadingConfiguration.newBuilder()
                .setURITranslatorConfiguration(uriTranslatorConfig)
                .freeze()
        return JsonSchemaFactory.newBuilder()
                .setLoadingConfiguration(loadingConfig)
                .freeze()
    }

    private fun parseJson(jsonAsString: String, kindOfText: String): JsonNode
    {
        return try
        {
            JsonLoader.fromString(jsonAsString)
        }
        catch (e: JsonParseException)
        {
            throw Exception("Failed to parse $kindOfText text as JSON.\nText was: $jsonAsString\n\n$e")
        }
    }
}