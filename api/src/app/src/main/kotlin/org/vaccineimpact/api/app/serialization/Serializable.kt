package org.vaccineimpact.api.app.serialization

import java.io.OutputStream

interface StreamSerializable
{
    fun serialize(stream: OutputStream, serializer: Serializer): Unit
}