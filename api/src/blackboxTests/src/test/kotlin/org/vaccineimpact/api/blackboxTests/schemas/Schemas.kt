package org.vaccineimpact.api.blackboxTests.schemas

import org.vaccineimpact.api.validateSchema.Validator

interface Schema
{
    val validator: Validator
    fun validateResponse(response: String, contentType: String?): Unit
    fun validateRequest(request: String): Unit
}