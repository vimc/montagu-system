package uk.ac.imperial.vimc.demo.app.errors

import uk.ac.imperial.vimc.demo.app.models.ErrorInfo

class MissingRequiredParameterError(message: String)
    : VimcError(400, listOf(ErrorInfo("missing-parameter", message)))
{
    constructor(parameterName: String, context: String? = null):
            this(MissingParameter(parameterName, context).toString())
}

class MissingParameter(val parameterName: String, val context: String? = null)
{
    override fun toString(): String
    {
        var message = "Missing required parameter '$parameterName'"
        if (context != null)
        {
            message = "$message in context: $context"
        }
        return message
    }
}