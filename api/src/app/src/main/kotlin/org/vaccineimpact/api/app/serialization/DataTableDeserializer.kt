package org.vaccineimpact.api.app.serialization

import com.opencsv.CSVReader
import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.app.errors.ValidationError
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.helpers.FlexibleColumns
import java.io.StringReader
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.KType
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.primaryConstructor

class HeaderDefinition(name: String, val type: KType, serializer: Serializer)
{
    val name = serializer.convertFieldName(name)
}

data class TableDefinition<out T>(
        val fixedHeaders: List<HeaderDefinition>,
        val constructor: KFunction<T>,
        val flexibleType: KType? = null
)
{
    val flexible = flexibleType != null
    val headerCount = fixedHeaders.size

    fun getExtraHeaders(headers: List<String>) = headers.drop(this.fixedHeaders.size)
}

class DataTableDeserializer
{
    fun <T : Any> deserialize(body: String, type: KClass<T>, serializer: Serializer): Sequence<T>
    {
        val definition = getTableDefinition(type, serializer)
        val constructor = definition.constructor
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
            definition: TableDefinition<T>,
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
        var args = row.zip(definition.fixedHeaders).map { (raw, header) ->
            deserialize(raw, header.type, rowIndex, header.name, problems)
        }
        if (definition.flexibleType != null)
        {
            val map = row.drop(definition.headerCount).zip(flexibleHeaders).map({ (raw, key) ->
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
            definition: TableDefinition<*>,
            actualHeaders: List<String>
    ): List<ErrorInfo>
    {
        val problems = mutableListOf<ErrorInfo>()
        var index = 0
        while (index < maxOf(definition.headerCount, actualHeaders.size))
        {
            val expected = definition.fixedHeaders.getOrNull(index)
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

    private fun <T: Any> getTableDefinition(type: KClass<T>, serializer: Serializer): TableDefinition<T>
    {
        val constructor = type.primaryConstructor
            ?: throw Exception("Cannot deserialize to type ${type.simpleName} - it has no primary constructor")
        val headers = constructor.parameters
                    .map { HeaderDefinition(it.name!!, it.type, serializer) }

        return if (type.findAnnotation<FlexibleColumns>() != null)
        {
            // If the last argument is a map, get the type of the values the map stores
            val flexibleType = constructor.parameters.last().type.arguments.last().type
            TableDefinition(headers.dropLast(1), constructor, flexibleType)
        }
        else
        {
            TableDefinition(headers, constructor)
        }
    }
}