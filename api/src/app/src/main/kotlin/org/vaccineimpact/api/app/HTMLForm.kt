package org.vaccineimpact.api.app

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import spark.Request

object HTMLFormHelpers
{
    val requiredContentType = "application/x-www-form-urlencoded"

    fun checkForm(request: Request, expectedContents: Map<String, String>): HTMLFormValidation
    {
        if (!isHTMLForm(request))
        {
            return HTMLFormValidation(false, "Content-Type must be '$requiredContentType'")
        }
        for ((key, value) in expectedContents)
        {
            if (request.queryParams(key) != value)
            {
                return HTMLFormValidation(false, "Expected form content include $key=$value")
            }
        }
        return HTMLFormValidation(true)
    }

    fun isHTMLForm(request: Request) = request.contentType() == requiredContentType
}

data class HTMLFormValidation(val isOkay: Boolean, val problem: String? = null)