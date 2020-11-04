package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.errors.DuplicateKeyError
import org.vaccineimpact.api.app.errors.ForeignKeyError
import org.vaccineimpact.api.app.errors.MontaguError
import org.vaccineimpact.api.app.errors.UnexpectedError

open class PostgresErrorHandler
{
    private val foreignKeyErrorRegex = Regex("violates foreign key constraint")
    private val foreignKeyFieldRegex = Regex("Detail: Key \\((?<field>.+)\\)=\\((?<value>.+)\\) is not present in table")
    private val duplicateKeyRegex = Regex("duplicate key value violates unique constraint")
    private val duplicateKeyFieldsRegex = Regex("""Detail: Key \((?<field>.+)\)=\((?<value>.+)\) already exists.""")
    private val psqlFuncRegex = Regex("""\w+\((?<inner>.+)\)""")

    open fun handleException(exception: Exception): MontaguError
    {
        val text = matchRecursive(exception)
                ?: return UnexpectedError.new(exception)

        val error = handleDuplicateKeyError(text) ?: handleForeignKeyError(text)
        return error ?: UnexpectedError.new(exception)
    }

    private fun matchRecursive(cause: Throwable?): String?
    {
        if (cause == null)
            return null

        if (duplicateKeyRegex.containsMatchIn(cause.toString()))
            return cause.toString()

        if (foreignKeyErrorRegex.containsMatchIn(cause.toString()))
            return cause.toString()

        return matchRecursive(cause.cause)
    }

    private fun handleDuplicateKeyError(text: String): MontaguError?
    {
        val match = duplicateKeyFieldsRegex.find(text)
        if (match != null)
        {
            val field = match.groups["field"]
            val value = match.groups["value"]
            if (field != null && value != null)
            {
                val map = mapOf(simplifyExpression(field.value.replace(" ", "")) to value.value)
                return DuplicateKeyError(map)
            }
        }
        return null
    }

    private fun handleForeignKeyError(text: String): MontaguError?
    {
        val match = foreignKeyFieldRegex.find(text)
        if (match != null)
        {
            val field = match.groups["field"]
            val value = match.groups["value"]
            if (field != null && value != null)
            {
                return ForeignKeyError(field.value, value.value)
            }
        }
        return null
    }

    fun simplifyExpression(psqlExpression: String): String
    {
        val match = psqlFuncRegex.find(psqlExpression)
        if (match != null)
        {
            val inner = match.groups["inner"]
            if (inner != null)
            {
                return simplifyExpression(inner.value)
            }
        }
        return psqlExpression
    }
}