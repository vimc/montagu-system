package org.vaccineimpact.api.app.controllers

import org.pac4j.http.client.direct.DirectBasicAuthClient
import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.FormHelpers
import org.vaccineimpact.api.app.HTMLForm
import org.vaccineimpact.api.app.HTMLFormHelpers
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.security.TokenIssuingConfigFactory
import org.vaccineimpact.api.app.security.USER_OBJECT
import org.vaccineimpact.api.models.AuthenticationResponse
import org.vaccineimpact.api.models.FailedAuthentication
import org.vaccineimpact.api.models.SuccessfulAuthentication
import org.vaccineimpact.api.security.MontaguUser
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Spark.before
import spark.route.HttpMethod

class AuthenticationController(context: ControllerContext, htmlFormHelpers: FormHelpers? = null) : AbstractController(context)
{
    override val urlComponent = "/"
    override fun endpoints(repos: Repositories) = listOf(
            oneRepoEndpoint("authenticate/", this::authenticate, repos.user, HttpMethod.post)
                    .withAdditionalSetup({ url, _ -> setupSecurity(url) })
    )

    val htmlFormHelpers = htmlFormHelpers ?: HTMLFormHelpers()

    fun authenticate(context: ActionContext, repo: UserRepository): AuthenticationResponse
    {
        val validationResult = htmlFormHelpers.checkForm(context,
                mapOf("grant_type" to "client_credentials")
        )
        return when (validationResult)
        {
            is HTMLForm.ValidForm ->
            {
                val user = getUserFromUserProfile(context)
                val token = tokenHelper.generateToken(user)
                repo.updateLastLoggedIn(user.username)
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
                "method:${HttpMethod.post}"
        ))
    }

    private fun getUserFromUserProfile(context: ActionContext)
            = context.userProfile.getAttribute(USER_OBJECT) as MontaguUser
}