package org.vaccineimpact.api.blackboxTests.schemas

import org.vaccineimpact.api.blackboxTests.validators.JSONValidator

class JSONSchema(val schemaName: String) : Schema
{
    override val validator = JSONValidator()

    override fun validate(response: String)
        = validator.validateAgainstSchema(response, schemaName)
}