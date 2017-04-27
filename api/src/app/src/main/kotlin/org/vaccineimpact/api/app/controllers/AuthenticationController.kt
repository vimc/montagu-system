package org.vaccineimpact.api.app.controllers

import eden.martin.webapi.security.SecurityConfigFactory
import org.pac4j.core.exception.HttpAction
import org.pac4j.http.client.direct.DirectBasicAuthClient
import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.models.SuccessfulAuthentication
import spark.Request
import spark.Response
import spark.Spark.before
import spark.route.HttpMethod

class AuthenticationController : AbstractController()
{
    override val urlComponent = "/"
    override val endpoints = listOf(
            EndpointDefinition("authenticate/", this::authenticate, HttpMethod.get, this::setupSecurity)
    )

    fun authenticate(request: Request, response: Response): SuccessfulAuthentication
    {
        return SuccessfulAuthentication("")
    }

    override fun transform(x: Any) = Serializer.gson.toJson(x)!!

    private fun setupSecurity(fullUrl: String)
    {
        val securityConfig = SecurityConfigFactory().build()
        before(fullUrl, SecurityFilter(securityConfig, DirectBasicAuthClient::class.java.simpleName))
    }
}