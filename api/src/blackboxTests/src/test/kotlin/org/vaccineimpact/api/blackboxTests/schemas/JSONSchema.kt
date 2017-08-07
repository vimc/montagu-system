package org.vaccineimpact.api.blackboxTests.schemas

import org.vaccineimpact.api.validateSchema.JSONValidator

class JSONSchema(val schemaName: String) : Schema
{
    override val validator = JSONValidator()

    override fun validateResponse(response: String)
        = validator.validateAgainstSchema(response, schemaName, wrappedInStandardResponseSchema = true)

    override fun validateRequest(request: String)
        = validator.validateAgainstSchema(request, schemaName, wrappedInStandardResponseSchema = false)
}