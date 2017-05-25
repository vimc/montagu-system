package org.vaccineimpact.api.app.controllers

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.errors.UnsupportedValueException
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Request
import spark.Response
import spark.Spark
import spark.route.HttpMethod

abstract class AbstractController
{
    private val logger = LoggerFactory.getLogger(AbstractController::class.java)

    abstract val urlComponent: String
    abstract val endpoints: Iterable<EndpointDefinition<Any>>

    fun mapEndpoints(urlBase: String, tokenHelper: WebTokenHelper): List<String>
    {
        return endpoints.map { mapEndpoint(it, urlBase, tokenHelper) }
    }

    private fun mapEndpoint(
            endpoint: EndpointDefinition<Any>,
            urlBase: String,
            tokenHelper: WebTokenHelper): String
    {
        val transformer = endpoint::transform
        val fullUrl = urlBase + urlComponent + endpoint.urlFragment
        val route = wrapRoute(endpoint.route)
        logger.info("Mapping $fullUrl")
        when (endpoint.method)
        {
            HttpMethod.get -> Spark.get(fullUrl, route, transformer)
            HttpMethod.post -> Spark.post(fullUrl, route, transformer)
            HttpMethod.put -> Spark.put(fullUrl, route, transformer)
            HttpMethod.patch -> Spark.patch(fullUrl, route, transformer)
            HttpMethod.delete -> Spark.delete(fullUrl, route, transformer)
            else -> throw UnsupportedValueException(endpoint.method)
        }
        endpoint.additionalSetup(fullUrl, tokenHelper)
        return fullUrl
    }

    private fun wrapRoute(route: (ActionContext) -> Any): (Request, Response) -> Any
    {
        return { req: Request, res: Response -> route(ActionContext(req, res)) }
    }
}