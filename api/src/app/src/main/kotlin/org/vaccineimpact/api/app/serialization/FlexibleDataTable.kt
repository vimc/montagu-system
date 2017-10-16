package org.vaccineimpact.api.app.serialization

import org.vaccineimpact.api.models.FlexibleProperty
import java.io.Writer
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.primaryConstructor

class FlexibleDataTable<T : Any>(data: Iterable<T>,
                                 private val flexibleHeaders: Iterable<Any>,
                                 type: KClass<T>)
    : DataTable<T>(data, type)
{
    private val flexibleProperty: KProperty1<T, *>
    private val properties = type.declaredMemberProperties

    init
    {
        val flexibleProperty = properties.firstOrNull { it.findAnnotation<FlexibleProperty>() != null }
                ?: throw Exception("No property marked as flexible." +
                " Use the DataTable class to serialise data with fixed headers.")

        flexibleProperty.returnType.arguments.last().type
                ?: throw Exception("Properties marked as flexible must be of " +
                "type Map<*, *>, where * can be whatever you like.")

        this.flexibleProperty = flexibleProperty
    }

    override fun toCSV(target: Writer, serializer: Serializer)
    {
        val headers = getHeaders(type, serializer)
        val flexibleHeaders = flexibleHeaders

        MontaguCSVWriter(target).use { csv ->
            val allHeaders = headers.map { it.name }.toTypedArray()
                    .plus(flexibleHeaders.map { it.toString() })

            csv.writeNext(allHeaders)

            for (line in data)
            {
                val basicValuesAsArray = headers
                        .map { it.property.get(line) }
                        .map { serializeValue(it, serializer) }
                        .toTypedArray()

                val flexibleValuesAsArray = flexibleHeaders
                        .map {
                            val map = flexibleProperty.get(line) as Map<*, *>
                            map[it]
                        }
                        .map { serializeValue(it, serializer) }
                        .toTypedArray()

                val allAsArray = basicValuesAsArray.plus(flexibleValuesAsArray)

                csv.writeNext(allAsArray, false)
            }
        }
    }

    override fun getHeaders(type: KClass<T>, serializer: Serializer): Iterable<Header<T>>
    {
        // We prefer to use the primary constructor parameters, if available, as they
        // remember their order
        val constructor = type.primaryConstructor

        if (constructor != null)
        {
            return constructor.parameters
                    .filter { it != flexibleProperty }
                    .mapNotNull { it.name }
                    .map { name -> Header(name, properties.single { name == it.name }, serializer) }
        }
        else
        {
            return properties
                    .filter { it != flexibleProperty }
                    .map { Header(it.name, it, serializer) }.dropLast(1)
        }
    }


    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: Iterable<R>, flexibleHeaders: Iterable<Any>)
                = FlexibleDataTable(data, flexibleHeaders, R::class)
    }
}