package org.vaccineimpact.api.app.serialization

import org.vaccineimpact.api.models.FlexibleData
import java.io.StringWriter
import java.io.Writer
import kotlin.reflect.*
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

class FlexibleDataTable<T : Any>(val flexibleData: FlexibleData<T>, type: KClass<T>): DataTable<T>(flexibleData.rows, type)
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
        val flexibleHeaders = flexibleData.flexibleHeaders

        MontaguCSVWriter(target).use { csv ->
            val allHeaders = headers.map { it.name }.toTypedArray()
                    .plus(flexibleHeaders.map{ it })

            csv.writeNext(allHeaders)

            for (line in data)
            {
                val asArray = headers
                        .map { it.property.get(line) }
                        .map { serializeValue(it, serializer) }
                        .toTypedArray()


                val flexibleValues = flexibleHeaders
                        .map {
                            val map = type.declaredMemberProperties.last().get(line) as Map<*, *>
                            map[it]
                        }
                        .map { serializeValue(it, serializer) }
                        .toTypedArray()

                val allAsArray = asArray.plus(flexibleValues)

                csv.writeNext(allAsArray, false)
            }
        }
    }

    private fun serializeValue(value: Any?, serializer: Serializer) = when (value)
    {
        null -> MontaguCSVWriter.NoValue
        is Enum<*> -> serializer.serializeEnum(value)
        else -> value.toString()
    }

    private fun getHeaders(type: KClass<T>, serializer: Serializer): Iterable<Header<T>>
    {
        val properties = type.declaredMemberProperties
        val constructor = type.primaryConstructor!!

        return constructor.parameters.dropLast(1)
                .map { it.name }
                .filterNotNull()
                .map { name -> Header(name, properties.single { name == it.name }, serializer) }
    }


    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: FlexibleData<R>) = FlexibleDataTable(data, R::class)
    }
}