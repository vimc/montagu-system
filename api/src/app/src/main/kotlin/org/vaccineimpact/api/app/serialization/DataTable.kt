package org.vaccineimpact.api.app.serialization

import com.opencsv.CSVWriter
import org.vaccineimpact.api.ContentTypes
import java.io.OutputStream
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

class DataTableHeader<T>(name: String, val property: KProperty1<T, *>, serializer: Serializer)
{
    val name = serializer.convertFieldName(name)
    override fun toString() = name
}

class DataTable<T : Any>(override val data: Iterable<T>, val type: KClass<T>): StreamSerializable<T>
{
    override val contentType = ContentTypes.csv

    override fun serialize(stream: OutputStream, serializer: Serializer)
    {
        val headers = getHeaders(type, serializer)
        stream.writer().let { writer ->
            CSVWriter(writer).let { csv ->
                val headerArray = headers.map { it.name }.toTypedArray()
                csv.writeNext(headerArray, false)
                for (line in data)
                {
                    val asArray = headers
                            .map { it.property.get(line) }
                            .map { serializer.serializeValueForCSV(it) }
                            .toTypedArray()
                    csv.writeNext(asArray, false)
                }
            }
            // We want to flush this writer, but we don't want to close the underlying stream, as there
            // be more to write to it
            writer.flush()
        }
    }

    private fun getHeaders(type: KClass<T>, serializer: Serializer): Iterable<DataTableHeader<T>>
    {
        // We assume headers are primary constructor parameters
        val constructor = type.primaryConstructor
                ?: throw Exception("Data type must have a primary constructor.")

        val properties = type.declaredMemberProperties

        return constructor.parameters
                .mapNotNull { it.name }
                .map { name -> DataTableHeader(name, properties.single { name == it.name }, serializer) }
    }

    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: Iterable<R>) = DataTable(data, R::class)
    }
}