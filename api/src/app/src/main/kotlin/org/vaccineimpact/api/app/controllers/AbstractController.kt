package org.vaccineimpact.api.app.controllers

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.app.errors.UnsupportedValueException
import spark.Request
import spark.Response
import spark.Spark
import spark.route.HttpMethod

abstract class AbstractController
{
    private val logger = LoggerFactory.getLogger(AbstractController::class.java)

    abstract val urlComponent: String
    abstract val endpoints: Iterable<EndpointDefinition>

    fun mapEndpoints(urlBase: String)
    {
        val transformer = this::transform
        for (endpoint in endpoints)
        {
            val (urlFragment, route, method) = endpoint
            val fullUrl = urlBase + urlComponent + urlFragment
            logger.info("Mapping $fullUrl")
            when (method)
            {
                HttpMethod.get -> Spark.get(fullUrl, route, transformer)
                HttpMethod.post -> Spark.post(fullUrl, route, transformer)
                HttpMethod.put -> Spark.put(fullUrl, route, transformer)
                HttpMethod.patch -> Spark.patch(fullUrl, route, transformer)
                HttpMethod.delete -> Spark.delete(fullUrl, route, transformer)
                else -> throw UnsupportedValueException(method)
            }
            endpoint.additionalSetup?.invoke(fullUrl)
        }
    }

    protected open fun transform(x: Any): String = Serializer.toResult(x)
}

data class EndpointDefinition(
        val urlFragment: String,
        val route: (Request, Response) -> Any,
        val method: HttpMethod = HttpMethod.get,
        val additionalSetup: ((String) -> Unit)? = null
)
{
    init
    {
        if (!urlFragment.endsWith("/"))
        {
            throw Exception("All endpoint definitions must end with a forward slash: $urlFragment")
        }
    }
}