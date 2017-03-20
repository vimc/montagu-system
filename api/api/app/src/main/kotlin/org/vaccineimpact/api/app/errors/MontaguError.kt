package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.app.models.ErrorInfo
import org.vaccineimpact.api.app.models.Result
import org.vaccineimpact.api.app.models.ResultStatus

abstract class MontaguError(val httpStatus: Int, val problems: Iterable<ErrorInfo>) : Exception(formatProblemsIntoMessage(problems))
{
    fun asResult() = Result(ResultStatus.FAILURE, null, problems)

    companion object
    {
        fun formatProblemsIntoMessage(problems: Iterable<ErrorInfo>): String
        {
            val joined = problems.map { it.message }.joinToString("\n")
            return "the following problems occurred: $joined"
        }
    }
}