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
    abstract val endpoints: Iterable<EndpointDefinition>

    fun mapEndpoints(urlBase: String, tokenHelper: WebTokenHelper): List<String>
    {
        return endpoints.map { mapEndpoint(it, urlBase, tokenHelper) }
    }

    private fun mapEndpoint(
            endpoint: EndpointDefinition,
            urlBase: String,
            tokenHelper: WebTokenHelper): String
    {
        val transformer = endpoint::transform
        val fullUrl = urlBase + urlComponent + endpoint.urlFragment
        val route = wrapRoute(endpoint.route)
        val contentType = endpoint.contentType

        logger.info("Mapping $fullUrl")
        when (endpoint.method)
        {
            HttpMethod.get -> Spark.get(fullUrl, contentType, route, transformer)
            HttpMethod.post -> Spark.post(fullUrl, contentType, route, transformer)
            HttpMethod.put -> Spark.put(fullUrl, contentType, route, transformer)
            HttpMethod.patch -> Spark.patch(fullUrl, contentType, route, transformer)
            HttpMethod.delete -> Spark.delete(fullUrl, contentType, route, transformer)
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