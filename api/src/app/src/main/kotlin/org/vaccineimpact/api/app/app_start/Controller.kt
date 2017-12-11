package org.vaccineimpact.api.app.app_start

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.db.Config

abstract class Controller(val context: ActionContext)
{
    fun objectCreation(context: ActionContext, urlPath: String): String
    {
        val url = Config["app.url"] + urlPath
        context.addResponseHeader("Location", url)
        context.setResponseStatus(201)
        return url
    }

    fun okayResponse() = "OK"
}