package org.vaccineimpact.api.app.context

import java.io.Reader

sealed class RequestBodySource
{
    abstract fun getContent(context: ActionContext): UploadedFile

    class Simple : RequestBodySource()
    {
        override fun getContent(context: ActionContext)
                = UploadedFile(context.requestReader(), context.contentType())
    }

    class HTMLMultipart(private val partName: String) : RequestBodySource()
    {
        override fun getContent(context: ActionContext) = context.getPart(partName)
    }
}

data class UploadedFile(val contents: Reader, val contentType: String?)

