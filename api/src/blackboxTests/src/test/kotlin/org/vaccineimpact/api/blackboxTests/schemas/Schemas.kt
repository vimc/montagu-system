package org.vaccineimpact.api.blackboxTests.schemas

import org.vaccineimpact.api.blackboxTests.validators.Validator

interface Schema
{
    val validator: Validator
    fun validate(response: String): Unit
}