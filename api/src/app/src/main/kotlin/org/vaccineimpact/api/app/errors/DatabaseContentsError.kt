package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class DatabaseContentsError(message: String) : MontaguError(500, listOf(
        ErrorInfo("unexpected-database-contents-error", message)
))