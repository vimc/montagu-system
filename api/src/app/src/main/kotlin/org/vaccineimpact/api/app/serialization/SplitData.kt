package org.vaccineimpact.api.app.serialization

data class SplitData<out Metadata, DataRow : Any>(
        val structuredMetadata: Metadata,
        val tableData: Serialisable<DataRow>
)
{
    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun serialize(serializer: Serializer): String
    {
        val metadata = serializer.toResult(structuredMetadata)
        val data = tableData.serialize(serializer)
        return "$metadata\n---\n$data"
    }
}