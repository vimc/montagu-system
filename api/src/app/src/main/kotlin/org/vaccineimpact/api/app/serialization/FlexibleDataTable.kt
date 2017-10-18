package org.vaccineimpact.api.app.serialization

import com.opencsv.CSVWriter
import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.models.helpers.FlexibleProperty
import java.io.OutputStream
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.KParameter
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.primaryConstructor

class FlexibleDataTable<T : Any>(override val data: Iterable<T>,
                                 private val flexibleHeaders: Iterable<Any>,
                                 val type: KClass<T>)
    : StreamSerializable<T>
{
    override val contentType = ContentTypes.csv

    private val constructor: KFunction<T> = type.primaryConstructor
            ?: throw Exception("Data type must have a primary constructor.")

    private val properties = type.declaredMemberProperties

    private val flexibleParameter: KParameter = constructor.parameters.firstOrNull {
        it.findAnnotation<FlexibleProperty>() != null
    }
            ?: throw Exception("No parameter marked as flexible." +
            " Use the DataTable class to serialise data with fixed headers.")

    private val flexibleProperty = properties.firstOrNull { it.name == flexibleParameter.name }
            ?: throw Exception("No property marked as flexible." +
            " Use the DataTable class to serialise data with fixed headers.")

    init
    {
        flexibleParameter.type.arguments.lastOrNull() ?:
                throw Exception("Properties marked as flexible must be of " +
                        "type Map<*, *>, where * can be whatever you like.")
    }

    override fun serialize(stream: OutputStream, serializer: Serializer)
    {
        val headers = getHeaders(type, serializer)
        val flexibleHeaders = flexibleHeaders

        stream.writer().let { writer ->
            CSVWriter(writer).let { csv ->

                val allHeaders = headers.map { it.name }.toTypedArray()
                        .plus(flexibleHeaders.map { it.toString() })

                csv.writeNext(allHeaders, false)

                for (line in data)
                {
                    val allAsArray = allValuesAsArray(headers, line, serializer)
                    csv.writeNext(allAsArray, false)
                }
            }
            // We want to flush this writer, but we don't want to close the underlying stream, as there
            // be more to write to it
            writer.flush()
        }
    }

    private fun allValuesAsArray(headers: Iterable<DataTableHeader<T>>, line: T, serializer: Serializer): Array<String>
    {
        val basicValuesAsArray = headers
                .map { it.property.get(line) }
                .map { serializer.serializeValue(it) }
                .toTypedArray()

        val flexibleValuesAsArray = flexibleHeaders
                .map { getFlexibleValue(it, line) }
                .map { serializer.serializeValue(it) }
                .toTypedArray()

        return basicValuesAsArray.plus(flexibleValuesAsArray)
    }

    private fun getFlexibleValue(key: Any, line: T): Any?
    {
        val map = flexibleProperty.get(line) as Map<*, *>
        return map[key]
    }

    private fun getHeaders(type: KClass<T>, serializer: Serializer): Iterable<DataTableHeader<T>>
    {
        // We assume headers are primary constructor parameters
        val constructor = type.primaryConstructor
                ?: throw Exception("Data type must have a primary constructor.")

        return constructor.parameters
                .filter { it != flexibleParameter }
                .mapNotNull { it.name }
                .map { name -> DataTableHeader(name, properties.single { name == it.name }, serializer) }

    }

    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: Iterable<R>, flexibleHeaders: Iterable<Any>)
                = FlexibleDataTable(data, flexibleHeaders, R::class)
    }
}