package org.vaccineimpact.api.app.controllers

import eden.martin.webapi.security.TokenIssuingConfigFactory
import org.pac4j.http.client.direct.DirectBasicAuthClient
import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.HTMLForm
import org.vaccineimpact.api.app.HTMLFormHelpers
import org.vaccineimpact.api.app.controllers.endpoints.BasicEndpoint
import org.vaccineimpact.api.app.security.SkipOptionsMatcher
import org.vaccineimpact.api.app.security.USER_OBJECT
import org.vaccineimpact.api.models.AuthenticationResponse
import org.vaccineimpact.api.models.FailedAuthentication
import org.vaccineimpact.api.models.SuccessfulAuthentication
import org.vaccineimpact.api.security.MontaguUser
import spark.Spark.before
import spark.route.HttpMethod

class AuthenticationController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/"
    override val endpoints = listOf(
            BasicEndpoint("authenticate/", this::authenticate, HttpMethod.post,
                    additionalSetupCallback = this::setupSecurity)
    )

    fun authenticate(context: ActionContext): AuthenticationResponse
    {
        val validationResult = HTMLFormHelpers.checkForm(context,
                mapOf("grant_type" to "client_credentials")
        )
        return when (validationResult)
        {
            is HTMLForm.ValidForm -> {
                val user = getUserFromUserProfile(context)
                val token = tokenHelper.generateToken(user)
                return SuccessfulAuthentication(token, tokenHelper.lifeSpan)
            }
            is HTMLForm.InvalidForm -> FailedAuthentication(validationResult.problem)
        }
    }

    private fun setupSecurity(fullUrl: String)
    {
        val config = TokenIssuingConfigFactory().build()
        before(fullUrl, SecurityFilter(
                config,
                DirectBasicAuthClient::class.java.simpleName,
                null,
                SkipOptionsMatcher.name))
    }

    private fun getUserFromUserProfile(context: ActionContext)
        = context.userProfile.getAttribute(USER_OBJECT) as MontaguUser
}