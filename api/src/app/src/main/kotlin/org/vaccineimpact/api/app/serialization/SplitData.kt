package org.vaccineimpact.api.app.serialization

import org.vaccineimpact.api.ContentTypes
import java.io.OutputStream

data class SplitData<out Metadata, DataRow : Any>(
        val structuredMetadata: Metadata,
        val tableData: DataTable<DataRow>
): StreamSerializable<DataRow>
{
    override val contentType = ContentTypes.json

    override val data = tableData.data

    override fun serialize(stream: OutputStream, serializer: Serializer)
    {
        val metadata = serializer.toResult(structuredMetadata)
        stream.writer().let {
            it.appendln(metadata)
            it.appendln("---")
            // We want to flush this writer, but we don't want to close the underlying stream, as there
            // be more to write to it
            it.flush()
        }
        tableData.serialize(stream, serializer)
    }
}