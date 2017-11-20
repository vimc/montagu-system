package org.vaccineimpact.api.app.context

import javax.servlet.MultipartConfigElement

sealed class RequestBodySource(val context: ActionContext)
{
    // Later, we should not return a string, but a stream or sequence of lines
    abstract fun getFile(): String

    class Simple(context: ActionContext) : RequestBodySource(context)
    {
        override fun getFile(): String
        {
            return context.request.body()
        }
    }

    class HTMLMultipart(context: ActionContext) : RequestBodySource(context)
    {
        val request = context.request

        init
        {
            if (request.raw().getAttribute("org.eclipse.jetty.multipartConfig") == null)
            {
                val multipartConfigElement = MultipartConfigElement(System.getProperty("java.io.tmpdir"))
                request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement)
            }
        }

        override fun getFile(): String
                = getPart("file")

        fun getPart(partName: String): String
        {
            return request.raw().getPart(partName).inputStream.bufferedReader().use {
                it.readText()
            }
        }
    }
}

