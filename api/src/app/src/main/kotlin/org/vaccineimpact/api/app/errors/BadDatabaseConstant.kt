package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.app.models.ErrorInfo

class BadDatabaseConstant(val value: String, val type: String) : MontaguError(500, listOf(
        ErrorInfo("database-error", "An unexpected value of '$value' was found for '$type'")
))