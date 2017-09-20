package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class OperationNotAllowedError(message: String) : MontaguError(401, listOf(
        ErrorInfo("forbidden", message)
))