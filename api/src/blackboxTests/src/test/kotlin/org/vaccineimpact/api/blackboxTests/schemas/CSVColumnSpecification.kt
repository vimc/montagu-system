package org.vaccineimpact.api.blackboxTests.schemas

import org.assertj.core.api.Assertions
import org.vaccineimpact.api.db.toDecimalOrNull

data class CSVColumnSpecification(val name: String, val type: CSVColumnType)
{
    fun assertMatches(actual: String, rowIndex: Int)
    {
        assertMatches(actual, rowIndex, type)
    }

    fun assertMatches(actual: String, rowIndex: Int, typeToCheck: CSVColumnType)
    {
        fun failAssert(message: String)
        {
            Assertions.fail("[Row $rowIndex, Column $name]: $message. Value supplied: '$actual'")
        }

        when (typeToCheck)
        {
            is CSVColumnType.IntColumn -> actual.toIntOrNull() ?: failAssert("Not an integer")
            is CSVColumnType.StringColumn -> if (actual.isNullOrBlank())
            {
                failAssert("Column is required")
            }
            is CSVColumnType.DecimalColumn -> actual.toDecimalOrNull() ?: failAssert("Not a decimal")
            is CSVColumnType.MaybeColumn -> if (actual != "NA")
            {
                assertMatches(actual, rowIndex, typeToCheck.wrapped)
            }
            is CSVColumnType.EnumColumn -> if (!typeToCheck.options.contains(actual))
            {
                val optionList = typeToCheck.options.joinToString()
                failAssert("Value must be one of: [$optionList]")
            }
        }
    }

    override fun toString() = "$name:$type"
}