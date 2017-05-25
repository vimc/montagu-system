package org.vaccineimpact.api.app.serialization

import java.io.StringWriter
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

class Header<T>(private val name: String, val property: kotlin.reflect.KProperty1<T, *>)
{
    fun name(serializer: Serializer) = serializer.convertFieldName(name)
}

open class DataTable<T : Any>(val data: Iterable<T>, val type: kotlin.reflect.KClass<T>)
{
    open fun serialize(serializer: Serializer): String
    {
        return StringWriter().use {
            toCSV(it, serializer)
            it.toString()
        }
    }

    private fun toCSV(target: java.io.Writer, serializer: Serializer)
    {
        val headers = getHeaders(type).toList()
        MontaguCSVWriter(target).use { csv ->
            csv.writeNext(headers.map { it.name(serializer) }.toTypedArray())
            for (line in data)
            {
                for (p in type.declaredMemberProperties)
                {
                    p.get(line)
                }
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

    private fun getHeaders(type: kotlin.reflect.KClass<T>): Iterable<org.vaccineimpact.api.app.serialization.Header<T>>
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
                    .map { name -> org.vaccineimpact.api.app.serialization.Header(name, properties.single { name == it.name }) }
        }
        else
        {
            return properties.map { org.vaccineimpact.api.app.serialization.Header(it.name, it) }
        }
    }

    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: Iterable<R>) = org.vaccineimpact.api.app.serialization.DataTable(data, R::class)
    }
}