package org.vaccineimpact.api.app

import java.io.StringWriter

data class SplitData<out Metadata, DataRow : Any>(
        val structuredMetadata: Metadata,
        val tableData: DataTable<DataRow>
)
{
    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun serialize(): String
    {
        val target = StringWriter()
        val metadata = Serializer.toResult(structuredMetadata)
        val data = tableData.toCSV(target)
        return "$metadata\n---\n$target"
    }
}