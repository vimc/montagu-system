package org.vaccineimpact.api.app.requests

import org.apache.commons.fileupload.FileItemStream
import org.apache.commons.fileupload.servlet.ServletFileUpload
import org.vaccineimpact.api.app.context.InMemoryRequestData
import org.vaccineimpact.api.app.errors.MissingRequiredMultipartParameterError
import javax.servlet.http.HttpServletRequest

interface MultipartData
{
    fun isMultipartContent(request: HttpServletRequest): Boolean
    fun parts(request: HttpServletRequest): Sequence<FileItemStream>
}

// A simple wrapper to enable us to mock things out in unit tests
class ServletFileUploadWrapper : MultipartData
{
    override fun isMultipartContent(request: HttpServletRequest) = ServletFileUpload.isMultipartContent(request)

    override fun parts(request: HttpServletRequest): Sequence<FileItemStream>
    {
        val iterator = ServletFileUpload().getItemIterator(request)
        return generateSequence {
            if (iterator.hasNext()) iterator.next() else null
        }
    }
}

class MultipartDataMap(private val map: Map<String, InMemoryRequestData>)
{
    constructor(vararg pairs: Pair<String, InMemoryRequestData>)
            : this(mapOf(*pairs))

    operator fun get(fieldName: String): InMemoryRequestData
    {
        return map[fieldName]
                ?: throw MissingRequiredMultipartParameterError(fieldName)
    }
}

fun FileItemStream.contents() = this.openStream().bufferedReader().readText()
