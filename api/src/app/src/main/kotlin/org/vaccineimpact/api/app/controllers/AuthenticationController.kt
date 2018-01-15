package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.FormHelpers
import org.vaccineimpact.api.app.HTMLForm
import org.vaccineimpact.api.app.HTMLFormHelpers
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.security.montaguUser
import org.vaccineimpact.api.models.AuthenticationResponse
import org.vaccineimpact.api.models.FailedAuthentication
import org.vaccineimpact.api.models.SuccessfulAuthentication
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper

class AuthenticationController(context: ActionContext,
                               private val userRepository: UserRepository,
                               private val htmlFormHelpers: FormHelpers = HTMLFormHelpers(),
                               private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair))
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
                val user = context.userProfile!!.montaguUser()!!
                val token = tokenHelper.generateToken(user)
                userRepository.updateLastLoggedIn(user.username)
                return SuccessfulAuthentication(token, tokenHelper.lifeSpan)
            }
            is HTMLForm.InvalidForm -> FailedAuthentication(validationResult.problem)
        }
    }

    fun setShinyCookie(): String
    {
        val user = userRepository.getUserByUsername(context.username!!)
        val montaguUser = userRepository.getMontaguUserByEmail(user.email)
        val shinyToken = tokenHelper.generateShinyToken(montaguUser!!)
        context.addResponseHeader("Set-Cookie", "jwt_token=$shinyToken; Path=/; Secure; HttpOnly; SameSite=Lax")
        context.addResponseHeader("Access-Control-Allow-Credentials", "true")
        return okayResponse()
    }
}