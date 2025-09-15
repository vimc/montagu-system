package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus

abstract class MontaguError(
        open val httpStatus: Int,
        val problems: Iterable<ErrorInfo>
) : Exception(formatProblemsIntoMessage(problems))
{
    open fun asResult() = Result(ResultStatus.FAILURE, null, problems)

    companion object
    {
        fun formatProblemsIntoMessage(problems: Iterable<ErrorInfo>): String
        {
            val joined = problems.map { it.message }.joinToString("\n")
            return "the following problems occurred:\n$joined"
        }
    }
}