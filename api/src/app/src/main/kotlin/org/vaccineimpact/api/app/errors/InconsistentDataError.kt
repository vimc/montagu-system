package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class InconsistentDataError(message: String) : MontaguError(400, listOf(
        ErrorInfo("inconsistent-data", message)
))