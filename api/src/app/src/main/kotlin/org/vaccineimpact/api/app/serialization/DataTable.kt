package org.vaccineimpact.api.app.serialization

import com.opencsv.CSVReader
import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.app.errors.ValidationError
import org.vaccineimpact.api.models.ErrorInfo
import java.io.StringReader
import java.io.StringWriter
import java.io.Writer
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.KProperty1
import kotlin.reflect.full.createType
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.isSubtypeOf
import kotlin.reflect.full.primaryConstructor

class Header<T>(private val name: String, val property: KProperty1<T, *>)
{
    fun name(serializer: Serializer) = serializer.convertFieldName(name)
}

data class HeaderDefinition<out T>(
        val headers: List<Header<*>>,
        val constructor: KFunction<T>?,
        val flexible: Boolean = false
)

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
        val headers = getHeaders(type).headers
        MontaguCSVWriter(target).use { csv ->
            csv.writeNext(headers.map { it.name(serializer) }.toTypedArray())
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
            val definition = getHeaders(type)
            val constructor = definition.constructor
                ?: throw Exception("Cannot deserialize to type ${type.simpleName} - it has no primary constructor")
            val reader = CSVReader(StringReader(body))

            var row = reader.readNext()
            val headers = row.toList()
            val headerProblems = checkHeaders(definition, headers, serializer)
            if (headerProblems.any())
            {
                throw ValidationError(headerProblems)
            }

            val rows = generateSequence { reader.readNext() }
            val problems = mutableListOf<ErrorInfo>()
            val result = rows.withIndex().map { (i, row) ->
                deserializeRow(row.toList(), definition, constructor, headers.size, problems, i)
            }
            if (problems.any())
            {
                throw ValidationError(problems)
            }
            return result
        }

        private fun <T> deserializeRow(
                row: List<String>,
                definition: HeaderDefinition<T>,
                constructor: KFunction<T>,
                expectedColumnCount: Int,
                problems: MutableList<ErrorInfo>,
                index: Int
        ): T
        {
            if (row.size != expectedColumnCount)
            {
                problems.add(ErrorInfo("csv-wrong-row-length:$index", "Row $index has a different number of columns from the header row"))
            }
            val args = row.zip(definition.headers).map { (raw, header) ->
                Deserializer().deserialize<T>(raw, header.property.returnType)
            }
            return constructor.call(args)
        }

        private fun checkHeaders(
                definition: HeaderDefinition<*>,
                actualHeaders: List<String>,
                serializer: Serializer
        ): List<ErrorInfo>
        {
            val problems = mutableListOf<ErrorInfo>()
            var index = 0
            while (index < maxOf(definition.headers.size, actualHeaders.size))
            {
                val expected = definition.headers.getOrNull(index)
                val actual = actualHeaders.getOrNull(index)

                if (expected != null)
                {
                    val expectedName = expected.name(serializer)
                    if (actual != null)
                    {
                        if (expectedName != actual)
                        {
                            problems.add(ErrorInfo("unexpected-csv-header", "Expected column header '$expectedName'; found '$actual' instead (column $index)"))
                        }
                    }
                    else
                    {
                        problems.add(ErrorInfo("missing-csv-header", "Not enough column headers were provided. Expected a '$expectedName' header."))
                    }
                }
                else if (actual != null && !definition.flexible)
                {
                    problems.add(ErrorInfo("unexpected-csv-header", "Too many column headers were provided. Unexpected '$actual' header."))
                }
                index += 1
            }
            return problems
        }

        private fun <T: Any> getHeaders(type: KClass<T>): HeaderDefinition<T>
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
                        .map { name -> Header(name, properties.single { name == it.name }) }
            }
            else
            {
                properties.map { org.vaccineimpact.api.app.serialization.Header(it.name, it) }
            }

            return if (headers.last().property.returnType.isSubtypeOf(Map::class.createType()))
            {
                HeaderDefinition(headers.dropLast(1), constructor, flexible = true)
            }
            else
            {
                HeaderDefinition(headers, constructor)
            }
        }
    }
}