package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class BadRequest(message: String) : MontaguError(400, listOf(
        ErrorInfo("bad-request", message)
))