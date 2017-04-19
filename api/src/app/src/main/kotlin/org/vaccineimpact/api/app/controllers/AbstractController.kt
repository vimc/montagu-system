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
        val transformer = Serializer::toResult
        for ((urlFragment, route, method) in endpoints)
        {
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
        }
    }
}

data class EndpointDefinition(
        val urlFragment: String,
        val route: (Request, Response) -> Any,
        val method: HttpMethod = HttpMethod.get
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