package uk.ac.imperial.vimc.demo.app.errors

import uk.ac.imperial.vimc.demo.app.models.ErrorInfo

class MissingRequiredParameterError(parameterName: String, context: String? = null): VimcError(400, listOf(
        ErrorInfo("missing-parameter", formatMessage(parameterName, context))
))
{
    companion object
    {
        fun formatMessage(parameterName: String, context: String?): String
        {
            var message = "Missing required parameter '$parameterName'"
            if (context != null)
            {
                message = "$message in context: $context"
            }
            return message
        }
    }
}