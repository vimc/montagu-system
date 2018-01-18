package org.vaccineimpact.api.blackboxTests.schemas

import org.assertj.core.api.Assertions.assertThat
import org.vaccineimpact.api.validateSchema.Validator

object EmptySchema : Schema
{
    override val validator: Validator = EmptyValidator()

    override fun validateResponse(response: String, contentType: String?)
    {
        assertThat(response).isBlank()
    }

    override fun validateRequest(request: String)
    {
        assertThat(request).isBlank()
    }

    class EmptyValidator : Validator
    {
        override fun validateError(response: String, expectedErrorCode: String?, expectedErrorText: String?, assertionText: String?)
        {
            assertThat(response).isBlank()
        }

        override fun validateSuccess(response: String, assertionText: String?)
        {
            assertThat(response).isBlank()
        }
    }
}