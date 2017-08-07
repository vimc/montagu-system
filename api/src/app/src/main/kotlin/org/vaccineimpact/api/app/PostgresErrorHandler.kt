package org.vaccineimpact.api.app

import org.jooq.exception.DataAccessException
import org.vaccineimpact.api.app.errors.DuplicateKeyError
import org.vaccineimpact.api.app.errors.MontaguError
import spark.Request
import spark.Response

class PostgresErrorHandler
{
    private val duplicateKeyRegex = Regex("duplicate key value violates unique constraint")
    private val duplicateKeyFieldsRegex = Regex("""Detail: Key \((?<field>.+)\)=\((?<value>.+)\) already exists.""")
    private val psqlFuncRegex = Regex("""\w+\((?<inner>.+)\)""")

    fun handleException(exception: Exception, req: Request, res: Response, handler: ErrorHandler)
    {
        val text = exception.toString()
        if (duplicateKeyRegex.containsMatchIn(text))
        {
            val error = handleDuplicateKeyError(text)
            if (error != null)
            {
                return handler.handleError(error, req, res)
            }
        }
        handler.handleUnexpectedError(exception, req, res)
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
                val map = mapOf(simplifyExpression(field.value) to value.value)
                return DuplicateKeyError(map)
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