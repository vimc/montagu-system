package org.vaccineimpact.api.app.context

import org.vaccineimpact.api.app.InMemoryPart
import java.io.Reader
import java.io.StringReader

data class RequestData(val contents: Reader, val contentType: String?)

sealed class RequestBodySource
{
    abstract fun getContent(context: ActionContext): RequestData

    class Simple : RequestBodySource()
    {
        override fun getContent(context: ActionContext)
                = RequestData(context.requestReader(), context.contentType())
    }

    sealed class Multipart : RequestBodySource()
    {
        class FromStream(private val partName: String) : RequestBodySource()
        {
            override fun getContent(context: ActionContext) = context.getPart(partName)
        }

        class FromMemory(private val part: InMemoryPart) : RequestBodySource()
        {
            override fun getContent(context: ActionContext)
                    = RequestData(StringReader(part.contents), part.contentType)
        }
    }
}

