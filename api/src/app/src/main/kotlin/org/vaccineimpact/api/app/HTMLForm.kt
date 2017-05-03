package org.vaccineimpact.api.app

import spark.Request

object HTMLFormHelpers
{
    val requiredContentType = "application/x-www-form-urlencoded"

    fun checkForm(request: Request, expectedContents: Map<String, String>): HTMLForm
    {
        if (!isHTMLForm(request))
        {
            return HTMLForm.InvalidForm("Content-Type must be '$requiredContentType'")
        }
        for ((key, value) in expectedContents)
        {
            if (request.queryParams(key) != value)
            {
                return HTMLForm.InvalidForm("Expected form content include $key=$value")
            }
        }
        return HTMLForm.ValidForm()
    }

    fun isHTMLForm(request: Request) = request.contentType() == requiredContentType
}

sealed class HTMLForm
{
    class ValidForm : HTMLForm()
    class InvalidForm(val problem: String) : HTMLForm()
}