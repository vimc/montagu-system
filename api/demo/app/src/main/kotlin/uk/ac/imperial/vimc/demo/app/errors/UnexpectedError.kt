package uk.ac.imperial.vimc.demo.app.errors

import uk.ac.imperial.vimc.demo.app.models.ErrorInfo

class UnexpectedError : VimcError(500, listOf(
        ErrorInfo("unexpected-error", "An unexpected error occurred. Please see server logs for more details")
))