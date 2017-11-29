package org.vaccineimpact.api.app.errors

import org.apache.commons.lang3.RandomStringUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.ErrorHandler
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.ErrorInfo

val supportAddress = Config["contact.support"]

// The purpose of the code, even though it's not used anywhere else, is that the full text of the error gets logged.
// So if a user gives you a code like UAA-BBB-CCC you can then search through the logs to find and see the associated
// stack trace.
class UnexpectedError private constructor(exception: Exception) : MontaguError(500, listOf(ErrorInfo(
        "unexpected-error",
        "An unexpected error occurred. Please contact support at $supportAddress and quote this code: ${newCode()}"
)))
{
    companion object
    {
        fun new(exception: Exception, logger: Logger = LoggerFactory.getLogger(ErrorHandler::class.java)): UnexpectedError
        {
            logger.error(unhandledExceptionMessage, exception)
            return UnexpectedError(exception)
        }

        private const val unhandledExceptionMessage = "An unhandled exception occurred"
    }
}

private fun newCode(): String
{
    fun r(count: Int) = RandomStringUtils.randomAlphabetic(count).toLowerCase()
    return "u${r(2)}-${r(3)}-${r(3)}"
}
