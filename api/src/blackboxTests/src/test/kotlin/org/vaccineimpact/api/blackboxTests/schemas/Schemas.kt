package org.vaccineimpact.api.blackboxTests.schemas

interface Schema
{
    fun validate(jsonAsString: String): Unit
    fun validateError(jsonAsString: String,
                      expectedErrorCode: String? = null,
                      expectedErrorText: String? = null,
                      assertionText: String? = null)

    fun validateSuccess(jsonAsString: String, assertionText: String? = null)
}