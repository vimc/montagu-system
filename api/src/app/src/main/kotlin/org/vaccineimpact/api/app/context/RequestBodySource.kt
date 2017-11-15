package org.vaccineimpact.api.app.context

import javax.servlet.MultipartConfigElement

sealed class RequestBodySource
{
    // Later, we should not return a string, but a stream or sequence of lines
    abstract fun getBody(context: ActionContext): String

    class Simple : RequestBodySource()
    {
        override fun getBody(context: ActionContext): String
        {
            return context.request.body()
        }
    }

    class HTMLMultipartFile : RequestBodySource()
    {
        override fun getBody(context: ActionContext): String
        {
            val request = context.request
            if (request.raw().getAttribute("org.eclipse.jetty.multipartConfig") == null)
            {
                val multipartConfigElement = MultipartConfigElement(System.getProperty("java.io.tmpdir"))
                request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement)
            }

            return request.raw().getPart("file").inputStream.bufferedReader().use {
                it.readText()
            }
        }
    }
}

