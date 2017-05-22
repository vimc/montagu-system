package org.vaccineimpact.api.blackboxTests.schemas

class JSONSchema(val schemaName: String) : Schema
{
    val validator = org.vaccineimpact.api.blackboxTests.helpers.JSONValidator()

    override fun validate(jsonAsString: String)
    {
        val json = validator.parseJson(jsonAsString)
        // Everything must meet the basic response schema
        validator.checkResultSchema(json, jsonAsString, "success")
        // Then use the more specific schema on the data portion
        val data = json["data"]
        val schema = validator.readSchema(schemaName)
        validator.assertValidates(schema, data)
    }

    override fun validateError(
            jsonAsString: String,
            expectedErrorCode: String?,
            expectedErrorText: String?,
            assertionText: String?
    ) = validator.validateError(jsonAsString, expectedErrorCode, expectedErrorText, assertionText)

    override fun validateSuccess(jsonAsString: String, assertionText: String?)
        = validator.validateSuccess(jsonAsString, assertionText)
}