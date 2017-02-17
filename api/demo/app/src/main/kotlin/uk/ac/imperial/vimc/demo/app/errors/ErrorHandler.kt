package uk.ac.imperial.vimc.demo.app.errors

import com.google.gson.JsonSyntaxException
import org.slf4j.LoggerFactory
import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.Serializer
import uk.ac.imperial.vimc.demo.app.addDefaultResponseHeaders
import spark.Spark as spk

class ErrorHandler
{
    private val logger = LoggerFactory.getLogger(ErrorHandler::class.java)

    init
    {
        @Suppress("RemoveExplicitTypeArguments")
        sparkException<VimcError>(this::handleError)
        sparkException<JsonSyntaxException> { e, req, res -> handleError(UnableToParseJsonError(e), req, res) }
        sparkException<Exception> {
            e, req, res ->
            logger.error("An unhandled exception occurred", e)
            handleError(UnexpectedError(), req, res)
        }
    }

    private fun handleError(error: VimcError, req: Request, res: Response)
    {
        logger.warn("For request ${req.uri()}, a ${error::class.simpleName} occcurred with the following problems: ${error.problems}")
        res.body(Serializer.toJson(error.asResult()))
        res.status(error.httpStatus)
        addDefaultResponseHeaders(res)
    }

    // Just a helper to let us call Spark.exception using generic type parameters
    private inline fun <reified TException : Exception> sparkException(
            noinline handler: (exception: TException,
                               req: Request, res: Response) -> Unit)
    {
        return spark.Spark.exception(TException::class.java) {
            e, req, res ->
            handler(e as TException, req, res)
        }
    }

    companion object
    {
        fun setup() = ErrorHandler()
    }
}