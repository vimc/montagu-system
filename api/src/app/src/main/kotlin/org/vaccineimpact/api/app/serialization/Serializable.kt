package org.vaccineimpact.api.app.serialization

import java.io.OutputStream

interface StreamSerializable
{
    val contentType: String
    fun serialize(stream: OutputStream, serializer: Serializer)
}