package org.vaccineimpact.api.app.controllers

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.OneTimeLinkActionContext
import org.vaccineimpact.api.app.MontaguRedirectValidator
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
                                  private val redirectValidator: MontaguRedirectValidator = MontaguRedirectValidator(),
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

    fun getOneTimeLinkToken(
            context: ActionContext,
            repo: TokenRepository,
            action: OneTimeAction,
            duration: Duration = WebTokenHelper.oneTimeLinkLifeSpan
    ): String
    {
        val actionAsString = serializer.serializeEnum(action)
        val params = context.params()
        val queryString = context.queryString()
        val redirectUrl = context.queryParams("redirectUrl")

        if (redirectUrl != null && !redirectUrl.isEmpty())
        {
            redirectValidator.validateRedirectUrl(redirectUrl)
        }

        val token = tokenHelper.generateOneTimeActionToken(actionAsString, params, queryString, duration, context.username!!)
        repo.storeToken(token)
        return token
    }

    fun getSetPasswordToken(username: String, context: ActionContext, repo: TokenRepository): String
    {
        val params = mapOf(":username" to username)
        val contextWithParams = OneTimeLinkActionContext(params, emptyMap(), context, username)
        return getOneTimeLinkToken(contextWithParams, repo, OneTimeAction.SET_PASSWORD, duration = Duration.ofDays(1))
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

    fun objectCreation(context: ActionContext, urlFragment: String): String
    {
        val url = buildPublicUrl(urlFragment)
        context.addResponseHeader("Location", url)
        context.setResponseStatus(201)
        return url
    }

    fun okayResponse() = "OK"

    fun buildPublicUrl(urlFragment: String) = Config["app.url"] + urlBase + urlFragment
}