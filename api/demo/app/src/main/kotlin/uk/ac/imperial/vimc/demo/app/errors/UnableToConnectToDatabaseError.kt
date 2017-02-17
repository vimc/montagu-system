package uk.ac.imperial.vimc.demo.app.errors

import uk.ac.imperial.vimc.demo.app.models.ErrorInfo

class UnableToConnectToDatabaseError : VimcError(500, listOf(
        ErrorInfo("database-connection-error", "Unable to establish connection to the database")
))