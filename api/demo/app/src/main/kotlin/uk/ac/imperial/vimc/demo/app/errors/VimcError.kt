package uk.ac.imperial.vimc.demo.app.errors

import uk.ac.imperial.vimc.demo.app.models.ErrorInfo
import uk.ac.imperial.vimc.demo.app.models.Result
import uk.ac.imperial.vimc.demo.app.models.ResultStatus

abstract class VimcError(val httpStatus: Int, val problems: Iterable<ErrorInfo>) : Exception(formatProblemsIntoMessage(problems))
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