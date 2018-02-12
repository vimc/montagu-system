package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.requests.FormHelpers
import org.vaccineimpact.api.app.security.adapted
import org.vaccineimpact.api.app.requests.HTMLForm
import org.vaccineimpact.api.app.requests.HTMLFormHelpers
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.db.ConfigWrapper
import org.vaccineimpact.api.models.AuthenticationResponse
import org.vaccineimpact.api.models.FailedAuthentication
import org.vaccineimpact.api.models.SuccessfulAuthentication
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper

class AuthenticationController(context: ActionContext,
                               private val userRepository: UserRepository,
                               private val htmlFormHelpers: FormHelpers = HTMLFormHelpers(),
                               private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair),
                               private val config: ConfigWrapper = Config)
    : Controller(context)
{

    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.user)

    fun authenticate(): AuthenticationResponse
    {
        val validationResult = htmlFormHelpers.checkForm(context,
                mapOf("grant_type" to "client_credentials")
        )
        return when (validationResult)
        {
            is HTMLForm.ValidForm ->
            {
                val user = context.userProfile!!.adapted().internalUser!!
                val token = tokenHelper.generateToken(user)
                userRepository.updateLastLoggedIn(user.username)
                return SuccessfulAuthentication(token, tokenHelper.lifeSpan)
            }
            is HTMLForm.InvalidForm -> FailedAuthentication(validationResult.problem)
        }
    }

    fun setShinyCookie(): String
    {
        val internalUser = userRepository.getUserByUsername(context.username!!)
        val shinyToken = tokenHelper.generateShinyToken(internalUser)
        setCookie(shinyToken)
        context.addResponseHeader("Access-Control-Allow-Credentials", "true")
        return okayResponse()
    }

    fun clearShinyCookie(): String
    {
        setCookie("")
        context.addResponseHeader("Access-Control-Allow-Credentials", "true")
        return okayResponse()
    }

    private fun setCookie(value: String)
    {
        val secure = if (config.getBool("allow.localhost"))
        {
            ""
        }
        else
        {
            " Secure;"
        }
        context.addResponseHeader("Set-Cookie", "jwt_token=$value; Path=/;$secure HttpOnly; SameSite=Lax")
    }
}