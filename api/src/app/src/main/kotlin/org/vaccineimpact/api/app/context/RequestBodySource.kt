package org.vaccineimpact.api.app.context

import java.io.Reader

data class RequestData(val contents: Reader, val contentType: String?)

sealed class RequestBodySource
{
    abstract fun getContent(context: ActionContext): RequestData

    class Simple : RequestBodySource()
    {
        override fun getContent(context: ActionContext)
                = RequestData(context.requestReader(), context.contentType())
    }

    class HTMLMultipart(private val partName: String) : RequestBodySource()
    {
        override fun getContent(context: ActionContext) = context.getPart(partName)
    }
}

