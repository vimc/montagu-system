package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class UnexpectedError : MontaguError(500, listOf(
        ErrorInfo("unexpected-error", "An unexpected error occurred. Please see server logs for more details")
))