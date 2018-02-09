package org.vaccineimpact.api.app.context

import java.io.Reader
import java.io.StringReader

data class RequestData(val contents: Reader, val contentType: String?)

interface RequestDataSource
{
    fun getContent(): RequestData
}

class RequestBodySource(private val context: ActionContext) : RequestDataSource
{
    override fun getContent() = RequestData(context.requestReader(), context.contentType())
}

class MultipartStreamSource(val partName: String, private val context: ActionContext) : RequestDataSource
{
    override fun getContent() = context.getPart(partName)
}

data class InMemoryRequestData(val contents: String, val contentType: String?) : RequestDataSource
{
    override fun getContent() = RequestData(StringReader(contents), contentType)
}
