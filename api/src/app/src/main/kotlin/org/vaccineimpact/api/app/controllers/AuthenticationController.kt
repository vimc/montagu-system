package org.vaccineimpact.api.app.controllers

import eden.martin.webapi.security.SecurityConfigFactory
import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.profile.ProfileManager
import org.pac4j.http.client.direct.DirectBasicAuthClient
import org.pac4j.sparkjava.SecurityFilter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.HTMLFormHelpers
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.models.AuthenticationResponse
import org.vaccineimpact.api.models.FailedAuthentication
import org.vaccineimpact.api.models.SuccessfulAuthentication
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Request
import spark.Response
import spark.Spark.before
import spark.route.HttpMethod

class AuthenticationController(private val tokenHelper: WebTokenHelper) : AbstractController()
{
    override val urlComponent = "/"
    override val endpoints = listOf(
            EndpointDefinition("authenticate/", this::authenticate, HttpMethod.post, this::setupSecurity)
    )

    fun authenticate(request: Request, response: Response): AuthenticationResponse
    {
        val validationResult = HTMLFormHelpers.checkForm(request, mapOf("grant_type" to "client_credentials"))
        return when (validationResult.isOkay)
        {
            true -> {
                val user = getUserProfile(request, response)
                val token = tokenHelper.generateToken(user.username)
                return SuccessfulAuthentication(token, tokenHelper.lifeSpan)
            }
            false -> FailedAuthentication(validationResult.problem!!)
        }
    }

    override fun transform(x: Any) = Serializer.gson.toJson(x)!!

    private fun setupSecurity(fullUrl: String)
    {
        val securityConfig = SecurityConfigFactory().build()
        before(fullUrl, SecurityFilter(securityConfig, DirectBasicAuthClient::class.java.simpleName))
    }

    private fun getUserProfile(request: Request, response: Response): CommonProfile
    {
        val context = SparkWebContext(request, response)
        val manager = ProfileManager<CommonProfile>(context)
        return manager.getAll(false).single()
    }
}