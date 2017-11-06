package org.vaccineimpact.api.app

import com.google.gson.JsonSyntaxException
import org.jooq.exception.DataAccessException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.errors.MontaguError
import org.vaccineimpact.api.app.errors.UnableToParseJsonError
import org.vaccineimpact.api.app.errors.UnexpectedError
import org.vaccineimpact.api.serialization.MontaguSerializer
import spark.Request
import spark.Response
import spark.Spark as spk

@Suppress("RemoveExplicitTypeArguments")
open class ErrorHandler(private val logger: Logger = LoggerFactory.getLogger(ErrorHandler::class.java),
                        private val postgresHandler: PostgresErrorHandler = PostgresErrorHandler())
{
    private val unhandledExceptionMessage = "An unhandled exception occurred"

    init
    {
        sparkException<MontaguError>(this::handleError)
        sparkException<JsonSyntaxException> { e, req, res -> handleError(UnableToParseJsonError(e), req, res) }
        sparkException<DataAccessException> { e, req, res -> postgresHandler.handleException(e, req, res, this) }
        sparkException<Exception>(this::handleUnexpectedError)
    }

    open fun logExceptionAndReturnMontaguError(exception: kotlin.Exception, req: Request): MontaguError
    {
        val error = when (exception)
        {
            is MontaguError -> exception
            else ->
            {
                logger.error(unhandledExceptionMessage, exception)
                UnexpectedError()
            }
        }

        logMontaguError(error, req)
        return error
    }

    private fun logMontaguError(error: MontaguError, req: Request)
    {
        logger.warn("For request ${req.uri()}, a ${error::class.simpleName} occurred with the following problems: ${error.problems}")
    }

    open fun handleError(error: MontaguError, req: Request, res: Response)
    {
        logMontaguError(error, req)
        res.body(MontaguSerializer.instance.toJson(error.asResult()))
        res.status(error.httpStatus)
        addDefaultResponseHeaders(res)
    }

    open fun handleUnexpectedError(exception: Exception, req: Request, res: Response)
    {
        logger.error(unhandledExceptionMessage, exception)
        handleError(UnexpectedError(), req, res)
    }

    // Just a helper to let us call Spark.exception using generic type parameters
    private inline fun <reified TException : Exception> sparkException(
            noinline handler: (exception: TException,
                               req: Request, res: Response) -> Unit)
    {
        return spark.Spark.exception(TException::class.java) { e, req, res ->
            handler(e as TException, req, res)
        }
    }

    companion object
    {
        fun setup() = ErrorHandler()
    }
}