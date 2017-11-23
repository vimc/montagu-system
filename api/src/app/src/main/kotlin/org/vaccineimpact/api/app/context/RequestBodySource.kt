package org.vaccineimpact.api.app.context

sealed class RequestBodySource
{
    // Later, we should not return a string, but a stream or sequence of lines
    abstract fun getContent(context: ActionContext): String

    class Simple : RequestBodySource()
    {
        override fun getContent(context: ActionContext)
                = context.request.body()
    }

    class HTMLMultipart(private val partName: String) : RequestBodySource()
    {
        override fun getContent(context: ActionContext)
                = context.getPart(partName)
    }
}

