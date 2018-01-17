package org.vaccineimpact.api.app.controllers

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.OneTimeLinkActionContext
import org.vaccineimpact.api.app.MontaguRedirectValidator
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.getWrappedRoute
import org.vaccineimpact.api.app.errors.UnsupportedValueException
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import spark.Spark
import spark.route.HttpMethod
import java.time.Duration

abstract class AbstractController(controllerContext: ControllerContext,
                                  private val redirectValidator: RedirectValidator = MontaguRedirectValidator(),
                                  protected val serializer: Serializer = MontaguSerializer.instance)
{
    protected val logger: Logger = LoggerFactory.getLogger(AbstractController::class.java)
    protected val repos = controllerContext.repositoryFactory
    private val urlBase = controllerContext.urlBase
    val tokenHelper = controllerContext.tokenHelper

    abstract val urlComponent: String
    abstract fun endpoints(repos: RepositoryFactory): Iterable<EndpointDefinition<*>>

    fun mapEndpoints(): List<String>
    {
        return endpoints(repos).map { mapEndpoint(it, urlBase, tokenHelper) }
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
        endpoint.additionalSetup(fullUrl, tokenHelper, repos)
        return fullUrl
    }
}