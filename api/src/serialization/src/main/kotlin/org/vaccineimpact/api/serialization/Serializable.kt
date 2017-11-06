package org.vaccineimpact.api.serialization

import java.io.OutputStream

interface StreamSerializable<out T>
{
    val contentType: String
    fun serialize(stream: OutputStream, serializer: Serializer)
    val data: Sequence<T>
}