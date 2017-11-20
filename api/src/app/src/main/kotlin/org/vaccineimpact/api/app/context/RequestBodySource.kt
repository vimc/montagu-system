package org.vaccineimpact.api.app.context

sealed class RequestBodySource
{
    // Later, we should not return a string, but a stream or sequence of lines
    abstract fun getFile(context: ActionContext): String

    class Simple : RequestBodySource()
    {
        override fun getFile(context: ActionContext): String
                = context.request.body()
    }

    class HTMLMultipart : RequestBodySource()
    {
        override fun getFile(context: ActionContext): String
                = context.getPart("file")
    }
}

