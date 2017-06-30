package org.vaccineimpact.api.app.controllers

import eden.martin.webapi.security.TokenIssuingConfigFactory
import org.pac4j.http.client.direct.DirectBasicAuthClient
import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.HTMLForm
import org.vaccineimpact.api.app.HTMLFormHelpers
import org.vaccineimpact.api.app.controllers.endpoints.basicEndpoint
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.SkipOptionsMatcher
import org.vaccineimpact.api.app.security.USER_OBJECT
import org.vaccineimpact.api.models.AuthenticationResponse
import org.vaccineimpact.api.models.FailedAuthentication
import org.vaccineimpact.api.models.SuccessfulAuthentication
import org.vaccineimpact.api.security.MontaguUser
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Spark.before
import spark.route.HttpMethod

class AuthenticationController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/"
    override fun endpoints(repos: Repositories) = listOf(
            basicEndpoint("authenticate/", this::authenticate,  HttpMethod.post)
                    .withAdditionalSetup(this::setupSecurity)
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

    private fun setupSecurity(fullUrl: String, tokenHelper: WebTokenHelper)
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