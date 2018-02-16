package org.vaccineimpact.api.app.context

import java.io.Reader
import java.io.StringReader

interface RequestDataSource
{
    fun getContent(): Reader
}

class RequestBodySource(private val context: ActionContext) : RequestDataSource
{
    override fun getContent() = context.requestReader()
}

class MultipartStreamSource(val partName: String, private val context: ActionContext) : RequestDataSource
{
    override fun getContent() = context.getPart(partName)
}

data class InMemoryRequestData(val contents: String) : RequestDataSource
{
    override fun getContent() = StringReader(contents)
}
