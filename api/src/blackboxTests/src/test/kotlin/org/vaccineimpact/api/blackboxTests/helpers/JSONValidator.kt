package org.vaccineimpact.api.blackboxTests.helpers

import com.fasterxml.jackson.core.JsonParseException
import com.fasterxml.jackson.databind.JsonNode
import com.github.fge.jackson.JsonLoader
import com.github.fge.jsonschema.core.load.configuration.LoadingConfiguration
import com.github.fge.jsonschema.core.load.uri.URITranslatorConfiguration
import com.github.fge.jsonschema.main.JsonSchemaFactory
import org.assertj.core.api.Assertions

class JSONValidator
{
    private val schemaFactory = makeSchemaFactory()
    private val responseSchema = readSchema("Response")

    fun validateError(jsonAsString: String,
                               expectedErrorCode: String?,
                               expectedErrorText: String?,
                               assertionText: String?)
    {
        val json = parseJson(jsonAsString)
        checkResultSchema(json, jsonAsString, "failure", assertionText = assertionText)
        val error = json["errors"].first()
        if (expectedErrorCode != null)
        {
            Assertions.assertThat(error["code"].asText())
                    .withFailMessage("Expected error code to be '$expectedErrorCode' in $jsonAsString")
                    .isEqualTo(expectedErrorCode)
        }
        if (expectedErrorText != null)
        {
            Assertions.assertThat(error["message"].asText()).contains(expectedErrorText)
        }
    }
    fun validateSuccess(jsonAsString: String, assertionText: String? = null)
    {
        val json = parseJson(jsonAsString)
        checkResultSchema(json, jsonAsString, "success", assertionText = assertionText)
    }

    fun checkResultSchema(json: JsonNode, jsonAsString: String, expectedStatus: String, assertionText: String? = null)
    {
        assertValidates(responseSchema, json)
        val status = json["status"].textValue()
        Assertions.assertThat(status)
                .`as`(assertionText ?: "Check that the following response has status '$expectedStatus': $jsonAsString")
                .isEqualTo(expectedStatus)
    }

    fun readSchema(name: String): JsonNode = JsonLoader.fromResource("/spec/$name.schema.json")

    fun assertValidates(schema: JsonNode, json: JsonNode)
    {
        val report = schemaFactory.getJsonSchema(schema).validate(json)
        if (!report.isSuccess)
        {
            Assertions.fail("JSON failed schema validation. Attempted to validate: $json against $schema. Report follows: $report")
        }
    }

    private fun makeSchemaFactory(): JsonSchemaFactory
    {
        val namespace = "resource:/spec/"
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

    fun parseJson(jsonAsString: String): JsonNode
    {
        return try
        {
            JsonLoader.fromString(jsonAsString)
        }
        catch (e: JsonParseException)
        {
            throw Exception("Failed to parse text as JSON.\nText was: $jsonAsString\n\n$e")
        }
    }
}