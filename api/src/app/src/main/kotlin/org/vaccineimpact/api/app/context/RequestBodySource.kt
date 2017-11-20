package org.vaccineimpact.api.app.context

import java.io.IOException
import javax.servlet.MultipartConfigElement
import javax.servlet.ServletException

class HTMLMultipart(context: ActionContext)
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

    fun getPart(partName: String): String
    {
        // HttpServletRequest.getPart() throws ServletException if this request is not of type
        // multipart/form-data
        return request.raw().getPart(partName).inputStream.bufferedReader().use {
            it.readText()
        }
    }
}

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

