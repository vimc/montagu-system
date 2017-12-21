package org.vaccineimpact.api.app

import com.google.gson.JsonSyntaxException
import org.bouncycastle.cert.ocsp.Req
import org.jooq.exception.DataAccessException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.errors.MontaguError
import org.vaccineimpact.api.app.errors.UnableToParseJsonError
import org.vaccineimpact.api.app.errors.UnexpectedError
import org.vaccineimpact.api.app.errors.ValidationError
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import org.vaccineimpact.api.serialization.validation.ValidationException
import spark.Request
import spark.Response
import spark.Spark as spk

@Suppress("RemoveExplicitTypeArguments")
open class ErrorHandler(private val logger: Logger = LoggerFactory.getLogger(ErrorHandler::class.java),
                        private val postgresHandler: PostgresErrorHandler = PostgresErrorHandler(),
                        private val serializer: Serializer = MontaguSerializer.instance)
{
    init
    {
        sparkException<Exception>(this::handleError)
    }

    open fun logExceptionAndReturnMontaguError(exception: kotlin.Exception, req: Request): MontaguError
    {
        consumeRequest(req)
        val error = when (exception)
        {
            is MontaguError -> exception
            is ValidationException -> ValidationError(exception)
            is JsonSyntaxException -> UnableToParseJsonError(exception)
            is DataAccessException -> postgresHandler.handleException(exception)
            else -> UnexpectedError.new(exception, logger = logger)
        }
        logger.warn("For request ${req.uri()}, a ${error::class.simpleName} occurred with the following problems: ${error.problems}")
        return error
    }

    open fun handleError(exception: Exception, req: Request, res: Response)
    {
        val error = logExceptionAndReturnMontaguError(exception, req)
        res.body(serializer.toJson(error.asResult()))
        res.status(error.httpStatus)
        addDefaultResponseHeaders(res)
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

    // This makes sure we have finished consuming the request before returning
    // any error response.
    private fun consumeRequest(req: Request)
    {
        val inputStream = req.raw()?.inputStream
        if (inputStream != null)
        {
            val buffer = ByteArray(8096)
            while (inputStream.read(buffer) > 0)
            {
                //keep going
            }
        }
    }

    companion object
    {
        fun setup() = ErrorHandler()
    }
}