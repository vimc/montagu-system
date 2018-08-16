package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.logic.RepositoriesUserLogic
import org.vaccineimpact.api.app.logic.UserLogic
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.requests.FormHelpers
import org.vaccineimpact.api.app.requests.HTMLForm
import org.vaccineimpact.api.app.requests.HTMLFormHelpers
import org.vaccineimpact.api.app.security.internalUser
import org.vaccineimpact.api.models.AuthenticationResponse
import org.vaccineimpact.api.models.FailedAuthentication
import org.vaccineimpact.api.models.SuccessfulAuthentication
import org.vaccineimpact.api.security.CookieName
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.security.deflated

class AuthenticationController(context: ActionContext,
                               private val userLogic: UserLogic,
                               private val htmlFormHelpers: FormHelpers = HTMLFormHelpers(),
                               private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair))
    : Controller(context)
{

    constructor(context: ActionContext, repositories: Repositories)
            : this(context, RepositoriesUserLogic(repositories.user, WebTokenHelper(KeyHelper.keyPair)))

    fun authenticate(): AuthenticationResponse
    {
        val validationResult = htmlFormHelpers.checkForm(context,
                mapOf("grant_type" to "client_credentials")
        )
        return when (validationResult)
        {
            is HTMLForm.ValidForm ->
            {
                val user = context.userProfile!!.internalUser!!
                val token = userLogic.logInAndGetToken(user).deflated()
                context.setCookie(CookieName.Main, token)
                return SuccessfulAuthentication(token, tokenHelper.defaultLifespan)
            }
            is HTMLForm.InvalidForm -> FailedAuthentication(validationResult.problem)
        }
    }

    fun setShinyCookie(): String
    {
        val internalUser = userLogic.getUserByUsername(context.username!!)
        val shinyToken = tokenHelper.generateShinyToken(internalUser)
        context.setCookie(CookieName.Shiny, shinyToken)
        return okayResponse()
    }

    fun clearShinyCookie(): String
    {
        context.setCookie(CookieName.Shiny, "")
        return okayResponse()
    }
}