package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class UnableToConnectToDatabaseError(url: String) : MontaguError(500, listOf(
        ErrorInfo("database-connection-error", "Unable to establish connection to the database at $url")
))