package org.vaccineimpact.api.serialization.validation

import org.vaccineimpact.api.models.ErrorInfo

class ValidationException(val errors: List<ErrorInfo>)
    : Exception()