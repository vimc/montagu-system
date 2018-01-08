package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class MissingRequiredParameterError(parameterName: String) : MontaguError(400, listOf(ErrorInfo(
        "missing-required-parameter:$parameterName",
        "You must supply a '$parameterName' parameter in the query string"
)))

class MissingRequiredMultipartParameterError(parameterName: String) : MontaguError(400, listOf(ErrorInfo(
        "missing-required-parameter:$parameterName",
        "You must supply a '$parameterName' parameter in the multipart body"
)))