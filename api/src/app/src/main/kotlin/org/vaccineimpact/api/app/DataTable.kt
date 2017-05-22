package org.vaccineimpact.api.app

import com.opencsv.CSVWriter
import java.io.Writer
import kotlin.reflect.KClass
import kotlin.reflect.KProperty
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

class DataTable<T : Any>(val data: Iterable<T>, val type: KClass<T>)
{
    fun toCSV(target: Writer)
    {
        val properties = type.declaredMemberProperties
        val headers = getHeaders(type, properties)
                .map { Serializer.convertFieldName(it) }
                .toTypedArray()
        CSVWriter(target).use { csv ->
            csv.writeNext(headers)
            for (line in data)
            {
                val asArray = properties
                        .map { it.get(line).toString() }
                        .toTypedArray()
                csv.writeNext(asArray)
            }
        }
    }

    private fun getHeaders(type: KClass<T>, properties: Iterable<KProperty<*>>): Iterable<String>
    {
        // We prefer to use the primary constructor parameters, if available, as they
        // remember their order
        val constructor = type.primaryConstructor
        if (constructor != null)
        {
            return constructor.parameters.map { it.name }.filterNotNull()
        }
        else
        {
            return properties.map { it.name }
        }
    }

    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: Iterable<R>) = DataTable(data, R::class)
    }

}