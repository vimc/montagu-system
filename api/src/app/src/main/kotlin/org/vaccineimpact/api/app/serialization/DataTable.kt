package org.vaccineimpact.api.app.serialization

import com.opencsv.CSVReader
import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.app.errors.ValidationError
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.helpers.FlexibleColumns
import java.io.StringReader
import java.io.StringWriter
import java.io.Writer
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.KProperty1
import kotlin.reflect.KType
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.primaryConstructor

class Header<T>(name: String, val property: KProperty1<T, *>, serializer: Serializer)
{
    val name = serializer.convertFieldName(name)
    override fun toString() = name
}

data class HeaderDefinition<out T>(
        val headers: List<Header<*>>,
        val constructor: KFunction<T>?,
        val flexibleType: KType? = null
)
{
    val flexible = flexibleType != null
    val headerCount = headers.size

    fun getExtraHeaders(headers: List<String>) = headers.drop(this.headers.size)
}

open class DataTable<T : Any>(val data: Iterable<T>, val type: KClass<T>)
{
    open fun serialize(serializer: Serializer): String
    {
        return StringWriter().use {
            toCSV(it, serializer)
            it.toString()
        }
    }

    private fun toCSV(target: Writer, serializer: Serializer)
    {
        val headers = getHeaders(type, serializer).headers
        MontaguCSVWriter(target).use { csv ->
            csv.writeNext(headers.map { it.name }.toTypedArray())
            for (line in data)
            {
                val asArray = headers
                        .map { (it.property as KProperty1<T, *>).get(line) }
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


    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(data: Iterable<R>) = DataTable(data, R::class)

        fun <T: Any> deserialize(body: String, type: KClass<T>, serializer: Serializer): Sequence<T>
        {
            val definition = getHeaders(type, serializer)
            val constructor = definition.constructor
                ?: throw Exception("Cannot deserialize to type ${type.simpleName} - it has no primary constructor")
            val reader = CSVReader(StringReader(body.trim()))

            var row = reader.readNext()
            val headers = row.toList()
            val headerProblems = checkHeaders(definition, headers)
            if (headerProblems.any())
            {
                throw ValidationError(headerProblems)
            }
            val extraHeaders = definition.getExtraHeaders(headers)

            val rows = generateSequence { reader.readNext() }
            return rows.withIndex().map { (i, row) ->
                deserializeRow(row.toList(), definition, extraHeaders, constructor, i)
            }
        }

        private fun <T> deserializeRow(
                row: List<String>,
                definition: HeaderDefinition<T>,
                flexibleHeaders: List<String>,
                constructor: KFunction<T>,
                rowIndex: Int
        ): T
        {
            val problems = mutableListOf<ErrorInfo>()
            if (row.size != definition.headerCount + flexibleHeaders.size)
            {
                problems.add(ErrorInfo("csv-wrong-row-length:$rowIndex", "Row $rowIndex has a different number of columns from the header row"))
            }
            var args = row.zip(definition.headers).map { (raw, header) ->
                deserialize(raw, header.property.returnType, rowIndex, header.name, problems)
            }
            if (definition.flexibleType != null)
            {
                val map = row.drop(definition.headers.size).zip(flexibleHeaders).map({ (raw, key) ->
                    val value = deserialize(raw, definition.flexibleType, rowIndex, key, problems)
                    key to value
                }).toMap()
                args += map
            }
            if (problems.any())
            {
                throw ValidationError(problems)
            }
            return constructor.call(*args.toTypedArray())
        }

        private fun deserialize(raw: String, targetType: KType,
                                row: Int, column: String,
                                problems: MutableList<ErrorInfo>): Any?
        {
            return try
            {
                val value = Deserializer().deserialize(raw.trim(), targetType)
                value
            }
            catch (e: Exception)
            {
                problems.add(ErrorInfo(
                        "csv-bad-data-type:$row:$column",
                        "Unable to parse '$raw' as $targetType (Row $row, column $column)"
                ))
                null
            }
        }

        private fun checkHeaders(
                definition: HeaderDefinition<*>,
                actualHeaders: List<String>
        ): List<ErrorInfo>
        {
            val problems = mutableListOf<ErrorInfo>()
            var index = 0
            while (index < maxOf(definition.headers.size, actualHeaders.size))
            {
                val expected = definition.headers.getOrNull(index)
                val actual = actualHeaders.getOrNull(index)?.trim()

                if (expected != null)
                {
                    val expectedName = expected.name
                    if (actual != null)
                    {
                        if (expectedName != actual)
                        {
                            problems.add(ErrorInfo("csv-unexpected-header", "Expected column header '$expectedName'; found '$actual' instead (column $index)"))
                        }
                    }
                    else
                    {
                        problems.add(ErrorInfo("csv-missing-header", "Not enough column headers were provided. Expected a '$expectedName' header."))
                    }
                }
                else if (actual != null && !definition.flexible)
                {
                    problems.add(ErrorInfo("csv-unexpected-header", "Too many column headers were provided. Unexpected '$actual' header."))
                }
                index += 1
            }
            return problems
        }

        private fun <T: Any> getHeaders(type: KClass<T>, serializer: Serializer): HeaderDefinition<T>
        {
            // We prefer to use the primary constructor parameters, if available, as they
            // remember their order
            val properties = type.declaredMemberProperties
            val constructor = type.primaryConstructor
            val headers = if (constructor != null)
            {
                constructor.parameters
                        .map { it.name }
                        .filterNotNull()
                        .map { name -> Header(name, properties.single { name == it.name }, serializer) }
            }
            else
            {
                properties.map { org.vaccineimpact.api.app.serialization.Header(it.name, it, serializer) }
            }

            return if (type.findAnnotation<FlexibleColumns>() != null)
            {
                // What does the Map map to?
                val flexibleType = headers.last().property.returnType.arguments.last().type
                HeaderDefinition(headers.dropLast(1), constructor, flexibleType)
            }
            else
            {
                HeaderDefinition(headers, constructor)
            }
        }
    }
}