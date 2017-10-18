package org.vaccineimpact.api.app.serialization

import java.io.OutputStream

data class SplitData<out Metadata, DataRow : Any>(
        val structuredMetadata: Metadata,
        val tableData: DataTable<DataRow>
): StreamSerializable
{
    override fun serialize(stream: OutputStream, serializer: Serializer)
    {
        val metadata = serializer.toResult(structuredMetadata)
        stream.writer().use {
            it.appendln(metadata)
            it.appendln("---")
        }
        tableData.serialize(stream, serializer)
    }
}