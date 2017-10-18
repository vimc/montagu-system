package org.vaccineimpact.api.app.serialization

import com.opencsv.CSVWriter
import org.vaccineimpact.api.ContentTypes
import java.io.OutputStream
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

open class DataTable<T : Any>(val data: Iterable<T>, val type: KClass<T>): StreamSerializable
{
    override val contentType = ContentTypes.csv

    class Header<T>(name: String, val property: KProperty1<T, *>, serializer: Serializer)
    {
        val name = serializer.convertFieldName(name)
        override fun toString() = name
    }

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
                            .map { serializeValue(it, serializer) }
                            .toTypedArray()
                    csv.writeNext(asArray, false)
                }
            }
            // We want to flush this writer, but we don't want to close the underlying stream, as there
            // be more to write to it
            writer.flush()
        }
    }

    private fun serializeValue(value: Any?, serializer: Serializer) = when (value)
    {
        null -> noValue
        is Enum<*> -> serializer.serializeEnum(value)
        else -> value.toString()
    }

    private fun getHeaders(type: KClass<T>, serializer: Serializer): Iterable<Header<T>>
    {
        // We prefer to use the primary constructor parameters, if available, as they
        // remember their order
        val properties = type.declaredMemberProperties
        val constructor = type.primaryConstructor
        if (constructor != null)
        {
            return constructor.parameters
                    .map { it.name }
                    .filterNotNull()
                    .map { name -> Header(name, properties.single { name == it.name }, serializer) }
        }
        else
        {
            return properties.map { Header(it.name, it, serializer) }
        }
    }

    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: Iterable<R>) = DataTable(data, R::class)
        const val noValue = "<NA>"
    }
}