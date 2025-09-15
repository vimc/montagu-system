package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class InvalidOperationError(message: String) : MontaguError(400, listOf(
        ErrorInfo("invalid-operation", message)
))