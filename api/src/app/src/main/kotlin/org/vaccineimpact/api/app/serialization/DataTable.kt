package org.vaccineimpact.api.app.serialization

import java.io.StringWriter
import java.io.Writer
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

interface Serialisable<out T>
{
    fun serialize(serializer: Serializer): String
    val data: Iterable<T>
}

class TableHeader<T>(name: String, val property: KProperty1<T, *>, serializer: Serializer)
{
    val name = serializer.convertFieldName(name)
    override fun toString() = name
}

class DataTable<T : Any>(override val data: Iterable<T>, val type: KClass<T>) : Serialisable<T>
{

    override fun serialize(serializer: Serializer): String
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
                        .map { serializer.serializeValue(it) }
                        .toTypedArray()
                csv.writeNext(asArray, false)
            }
        }
    }

    private fun getHeaders(type: KClass<T>, serializer: Serializer): Iterable<TableHeader<T>>
    {
        // We assume headers are primary constructor parameters
        val constructor = type.primaryConstructor
                ?: throw Exception("Data type must have a primary constructor.")

        val properties = type.declaredMemberProperties

        return constructor.parameters
                .mapNotNull { it.name }
                .map { name -> TableHeader(name, properties.single { name == it.name }, serializer) }

    }

    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: Iterable<R>) = DataTable(data, R::class)
    }
}