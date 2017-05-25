package org.vaccineimpact.api.app.serialization

data class SplitData<out Metadata, DataRow : Any>(
        val structuredMetadata: Metadata,
        val tableData: DataTable<DataRow>
)
{
    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun serialize(serializer: Serializer): String
    {
        val target = java.io.StringWriter()
        val metadata = serializer.toResult(structuredMetadata)
        tableData.toCSV(target, serializer)
        return "$metadata\n---\n$target"
    }
}