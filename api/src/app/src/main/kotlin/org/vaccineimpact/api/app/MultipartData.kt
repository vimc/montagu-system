package org.vaccineimpact.api.app

import org.apache.commons.fileupload.FileItemStream
import org.apache.commons.fileupload.servlet.ServletFileUpload
import javax.servlet.http.HttpServletRequest

interface MultipartData
{
    fun isMultipartContent(request: HttpServletRequest): Boolean
    fun parts(request: HttpServletRequest) : Sequence<FileItemStream>
}

class ServletFileUploadWrapper : MultipartData
{
    override fun isMultipartContent(request: HttpServletRequest)
            = ServletFileUpload.isMultipartContent(request)

    override fun parts(request: HttpServletRequest): Sequence<FileItemStream>
    {
        val iterator = ServletFileUpload().getItemIterator(request)
        return generateSequence {
            if (iterator.hasNext()) iterator.next() else null
        }
    }
}