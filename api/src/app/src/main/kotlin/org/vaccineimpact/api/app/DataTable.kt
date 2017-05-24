package org.vaccineimpact.api.app

import java.io.Writer
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

class Header<T>(name: String, val property: KProperty1<T, *>)
{
    val name = Serializer.convertFieldName(name)
}

class DataTable<T : Any>(val data: Iterable<T>, val type: KClass<T>)
{
    fun toCSV(target: Writer)
    {

        val headers = getHeaders(type).toList()
        MontaguCSVWriter(target).use { csv ->
            csv.writeNext(headers.map { it.name }.toTypedArray())
            for (line in data)
            {
                for (p in type.declaredMemberProperties)
                {
                    p.get(line)
                }
                val asArray = headers
                        .map { it.property.get(line) }
                        .map { serialize(it) }
                        .toTypedArray()
                csv.writeNext(asArray, false)
            }
        }
    }

    private fun serialize(value: Any?) = when (value)
    {
        null -> MontaguCSVWriter.NoValue
        is Enum<*> -> Serializer.serializeEnum(value)
        else -> value.toString()
    }

    private fun getHeaders(type: KClass<T>): Iterable<Header<T>>
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
                    .map { name -> Header(name, properties.single { name == it.name }) }
        }
        else
        {
            return properties.map { Header(it.name, it) }
        }
    }

    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: Iterable<R>) = DataTable(data, R::class)
    }
}