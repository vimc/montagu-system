package org.vaccineimpact.api.app.serialization

import java.io.OutputStream

interface StreamSerializable<out T>
{
    val contentType: String
    fun serialize(stream: OutputStream, serializer: Serializer)
    val data: Iterable<T>
}