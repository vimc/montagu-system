package org.vaccineimpact.api.blackboxTests.schemas

import com.beust.klaxon.JsonArray

sealed class CSVColumnType
{
    class IntColumn : CSVColumnType()
    class StringColumn : CSVColumnType()
    class DecimalColumn : CSVColumnType()
    data class EnumColumn(val options: List<String>) : CSVColumnType()
    data class MaybeColumn(val wrapped: CSVColumnType) : CSVColumnType()

    override fun toString() = when (this)
    {
        is IntColumn -> "Int"
        is StringColumn -> "String"
        is DecimalColumn -> "Decimal"
        else -> super.toString()
    }

    companion object
    {
        fun parse(raw: Any?): CSVColumnType = when (raw)
        {
            "Int" -> IntColumn()
            "String" -> StringColumn()
            "Decimal" -> DecimalColumn()
            is JsonArray<*> -> EnumColumn(raw.value as List<String>)
            is String ->
            {
                if (raw.endsWith("?"))
                {
                    MaybeColumn(parse(raw.dropLast(1)))
                }
                else
                {
                    throwException(raw)
                }
            }
            else -> throwException(raw)
        }

        private fun <T> throwException(raw: Any?): T
        {
            throw Exception("Unable to parse CSV schema. Unknown column type '$raw'")
        }
    }
}