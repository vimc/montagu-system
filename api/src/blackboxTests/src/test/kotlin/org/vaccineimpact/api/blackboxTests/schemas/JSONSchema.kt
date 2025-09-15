package org.vaccineimpact.api.blackboxTests.schemas

import org.assertj.core.api.Assertions.assertThat
import org.vaccineimpact.api.validateSchema.JSONValidator

class JSONSchema(val schemaName: String) : Schema
{
    override val validator = JSONValidator()

    override fun validateResponse(response: String, contentType: String?)
    {
        assertThat(contentType).`as`("Content type").contains("application/json")
        validator.validateAgainstSchema(response, schemaName, wrappedInStandardResponseSchema = true)
    }

    override fun validateRequest(request: String)
        = validator.validateAgainstSchema(request, schemaName, wrappedInStandardResponseSchema = false)
}