package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class MissingRowsError(message: String) : MontaguError(400, listOf(
        ErrorInfo("missing-rows", message)
))