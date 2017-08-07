package org.vaccineimpact.api.blackboxTests.schemas

import org.vaccineimpact.api.validateSchema.Validator

interface Schema
{
    val validator: Validator
    fun validateResponse(response: String): Unit
    fun validateRequest(request: String): Unit
}