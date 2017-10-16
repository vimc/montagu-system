package org.vaccineimpact.api.app.serialization

import java.io.OutputStream

data class SplitData<out Metadata, DataRow : Any>(
        val structuredMetadata: Metadata,
        val tableData: DataTable<DataRow>
)
{
    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun serialize(stream: OutputStream, serializer: Serializer)
    {
        val metadata = serializer.toResult(structuredMetadata)
        val writer = stream.writer()
        writer.appendln(metadata)
        writer.appendln("---")
        tableData.serialize(stream, serializer)
    }
}