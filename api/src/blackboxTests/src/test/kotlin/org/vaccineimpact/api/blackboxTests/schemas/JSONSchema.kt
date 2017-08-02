package org.vaccineimpact.api.blackboxTests.schemas

import org.vaccineimpact.api.validateSchema.JSONValidator

class JSONSchema(val schemaName: String) : Schema
{
    override val validator = JSONValidator()

    override fun validate(response: String)
        = validator.validateResponseAgainstSchema(response, schemaName)
}