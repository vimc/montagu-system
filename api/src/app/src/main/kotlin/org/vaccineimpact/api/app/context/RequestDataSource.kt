package org.vaccineimpact.api.app.context

import java.io.InputStream
import java.io.Reader
import java.io.StringReader

interface RequestDataSource
{
    fun getContent(): InputStream

    companion object
    {
        /**
         * Automatically determines how to extract the main body of the request - either just the whole request
         * body or, in the case of a multipart file upload, one of the parts. If it is multipart, uses the
         * 'partNameToUseForMultipart' parameter to determine which part to use.
         *
         * It is recommended that for HTML forms under our control we always use <input name="file" />, and so
         * the default value for partNameToUseForMultipart will always be correct. However, for compatibility with
         * 3rd party forms, this value is configurable.
         */
        fun fromContentType(context: ActionContext, partNameToUseForMultipart: String = "file"): RequestDataSource
        {
            val type = context.contentType().toLowerCase()
            return when
            {
                type.startsWith("multipart/form-data") -> MultipartStreamSource(partNameToUseForMultipart, context)
                else -> RequestBodySource(context)
            }
        }
    }
}

class RequestBodySource(private val context: ActionContext) : RequestDataSource
{
    override fun getContent() = context.getInputStream()
}

class MultipartStreamSource(val partName: String, private val context: ActionContext) : RequestDataSource
{
    override fun getContent() = context.getPart(partName)
}

data class InMemoryRequestData(val contents: String) : RequestDataSource
{
    override fun getContent() = contents.byteInputStream()
}
