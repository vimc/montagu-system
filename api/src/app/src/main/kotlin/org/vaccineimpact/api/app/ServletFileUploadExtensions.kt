package org.vaccineimpact.api.app

import org.apache.commons.fileupload.FileItemStream
import org.apache.commons.fileupload.servlet.ServletFileUpload
import javax.servlet.http.HttpServletRequest

fun ServletFileUpload.partsAsSequence(request: HttpServletRequest): Sequence<FileItemStream>
{
    val iterator = this.getItemIterator(request)
    return  generateSequence {
        if (iterator.hasNext()) iterator.next() else null
    }
}