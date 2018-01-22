package org.vaccineimpact.api.blackboxTests.schemas

import org.assertj.core.api.Assertions.assertThat
import org.vaccineimpact.api.validateSchema.Validator

object EmptySchema : Schema
{
    override fun validateResponse(response: String, contentType: String?)
    {
        assertThat(response).isBlank()
    }

    override fun validateRequest(request: String)
    {
        assertThat(request).isBlank()
    }

    override val validator: Validator
        get() = throw Exception("Only JSON responses can communicate errors")
}