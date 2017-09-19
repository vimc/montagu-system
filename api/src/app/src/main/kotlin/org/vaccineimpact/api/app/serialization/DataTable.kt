package org.vaccineimpact.api.app.serialization

import java.io.StringWriter
import java.io.Writer
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

open class DataTable<T : Any>(val data: Iterable<T>, val type: KClass<T>)
{
    class Header<T>(name: String, val property: KProperty1<T, *>, serializer: Serializer)
    {
        val name = serializer.convertFieldName(name)
        override fun toString() = name
    }

    open fun serialize(serializer: Serializer): String
    {
        return StringWriter().use {
            toCSV(it, serializer)
            it.toString()
        }
    }

    private fun toCSV(target: Writer, serializer: Serializer)
    {
        val headers = getHeaders(type, serializer)
        MontaguCSVWriter(target).use { csv ->
            csv.writeNext(headers.map { it.name }.toTypedArray())
            for (line in data)
            {
                val asArray = headers
                        .map { it.property.get(line) }
                        .map { serializeValue(it, serializer) }
                        .toTypedArray()
                csv.writeNext(asArray, false)
            }
        }
    }

    private fun serializeValue(value: Any?, serializer: Serializer) = when (value)
    {
        null -> MontaguCSVWriter.Companion.NoValue
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
    }
}