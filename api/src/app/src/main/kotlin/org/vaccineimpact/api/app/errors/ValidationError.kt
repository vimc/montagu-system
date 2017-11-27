package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.serialization.validation.ValidationException

class ValidationError(errors: List<ErrorInfo>) : MontaguError(400, errors)
{
    constructor(exception: ValidationException)
            : this(exception.errors)
}