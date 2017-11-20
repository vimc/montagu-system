package org.vaccineimpact.api.app.context

import java.io.Reader
import javax.servlet.MultipartConfigElement

sealed class RequestBodySource
{
    abstract fun getBody(context: ActionContext): Reader

    class Simple : RequestBodySource()
    {
        override fun getBody(context: ActionContext): Reader
        {
            return context.request.raw().inputStream.bufferedReader()
        }
    }

    class HTMLMultipartFile : RequestBodySource()
    {
        override fun getBody(context: ActionContext): Reader
        {
            val request = context.request
            if (request.raw().getAttribute("org.eclipse.jetty.multipartConfig") == null)
            {
                val multipartConfigElement = MultipartConfigElement(System.getProperty("java.io.tmpdir"))
                request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement)
            }

            return request.raw().getPart("file").inputStream.bufferedReader()
        }
    }
}

