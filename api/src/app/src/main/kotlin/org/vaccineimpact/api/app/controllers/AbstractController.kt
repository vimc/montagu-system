package org.vaccineimpact.api.app.controllers

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.getWrappedRoute
import org.vaccineimpact.api.app.errors.UnsupportedValueException
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Spark
import spark.route.HttpMethod

abstract class AbstractController(controllerContext: ControllerContext)
{
    protected val logger: Logger = LoggerFactory.getLogger(AbstractController::class.java)
    protected val repos = controllerContext.repositories
    private val urlBase = controllerContext.urlBase
    val tokenHelper = controllerContext.tokenHelper

    abstract val urlComponent: String
    abstract fun endpoints(repos: Repositories): Iterable<EndpointDefinition<*>>

    fun mapEndpoints(): List<String>
    {
        return endpoints(repos).map { mapEndpoint(it, urlBase, tokenHelper) }
    }

    fun getOneTimeLinkToken(context: ActionContext, repo: TokenRepository, action: OneTimeAction): String
    {
        val actionAsString = Serializer.instance.serializeEnum(action)
        val params = context.params()
        val token = tokenHelper.generateOneTimeActionToken(actionAsString, params)
        repo.storeToken(token)
        return token
    }

    private fun mapEndpoint(
            endpoint: EndpointDefinition<*>,
            urlBase: String,
            tokenHelper: WebTokenHelper): String
    {
        val transformer = endpoint::transform
        val fullUrl = urlBase + urlComponent + endpoint.urlFragment
        val route = endpoint.getWrappedRoute()::handle
        val contentType = endpoint.contentType

        logger.info("Mapping $fullUrl as ${endpoint.method}")
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

    fun objectCreation(context: ActionContext, urlFragment: String): String
    {
        val url = buildPublicUrl(urlFragment)
        context.addResponseHeader("Location", url)
        context.setResponseStatus(201)
        return url
    }

    fun buildPublicUrl(urlFragment: String) = Config["app.url"] + urlBase + urlComponent + urlFragment
}