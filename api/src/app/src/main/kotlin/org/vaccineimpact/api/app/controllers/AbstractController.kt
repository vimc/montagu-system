package org.vaccineimpact.api.app.controllers

import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.profile.ProfileManager
import org.pac4j.sparkjava.SparkWebContext
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.errors.UnsupportedValueException
import org.vaccineimpact.api.models.ReifiedPermission
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

    fun mapEndpoints(urlBase: String, tokenHelper: WebTokenHelper)
    {
        val transformer = this::transform
        for (endpoint in endpoints)
        {
            val fullUrl = urlBase + urlComponent + endpoint.urlFragment
            val route = endpoint.route
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
        }
    }

    protected open fun transform(x: Any): String = Serializer.toResult(x)

    protected fun getUserProfile(request: Request, response: Response): CommonProfile
    {
        val context = SparkWebContext(request, response)
        val manager = ProfileManager<CommonProfile>(context)
        return manager.getAll(false).single()
    }

    protected fun getPermissions(request: Request, response: Response): List<ReifiedPermission>
    {
        val userProfile = getUserProfile(request, response)
        return userProfile.permissions.map { ReifiedPermission.parse(it) }
    }
}