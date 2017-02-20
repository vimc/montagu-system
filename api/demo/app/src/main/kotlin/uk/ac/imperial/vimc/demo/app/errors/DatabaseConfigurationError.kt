package uk.ac.imperial.vimc.demo.app.errors

import uk.ac.imperial.vimc.demo.app.models.ErrorInfo

class DatabaseConfigurationError(message: String) : VimcError(500, listOf(
        ErrorInfo("database-configuration-error", message)
))