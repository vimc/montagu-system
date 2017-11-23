package org.vaccineimpact.api.app.context

import java.io.Reader

sealed class RequestBodySource
{
    abstract fun getContent(context: ActionContext): Reader

    class Simple : RequestBodySource()
    {
        override fun getContent(context: ActionContext)
                = context.request.raw().inputStream.bufferedReader()
    }

    class HTMLMultipart(private val partName: String) : RequestBodySource()
    {
        override fun getContent(context: ActionContext)
                = context.getPart(partName)
    }
}

