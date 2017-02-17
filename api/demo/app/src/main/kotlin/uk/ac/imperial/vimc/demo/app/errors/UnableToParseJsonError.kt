package uk.ac.imperial.vimc.demo.app.errors

import com.google.gson.JsonSyntaxException
import uk.ac.imperial.vimc.demo.app.models.ErrorInfo

class UnableToParseJsonError(e: JsonSyntaxException) : VimcError(400, listOf(
        ErrorInfo("bad-json", "Unable to parse supplied JSON: $e")
))