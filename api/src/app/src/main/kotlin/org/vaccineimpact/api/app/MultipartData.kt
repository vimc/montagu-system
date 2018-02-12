package org.vaccineimpact.api.app

import org.apache.commons.fileupload.FileItemStream
import org.apache.commons.fileupload.servlet.ServletFileUpload
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

data class InMemoryPart(val contents: String, val contentType: String?)

class MultipartDataMap(private val map: Map<String, InMemoryPart>)
{
    constructor(vararg pairs: Pair<String, InMemoryPart>)
            : this(mapOf(*pairs))

    operator fun get(fieldName: String): InMemoryPart
    {
        return map[fieldName]
                ?: throw MissingRequiredMultipartParameterError(fieldName)
    }
}

fun FileItemStream.contents() = this.openStream().bufferedReader().readText()
