package org.vaccineimpact.api.app.controllers

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.OneTimeLinkActionContext
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.NewUserEmail
import org.vaccineimpact.api.emails.PasswordSetEmail
import org.vaccineimpact.api.emails.getEmailManager
import org.vaccineimpact.api.models.helpers.OneTimeAction

class NewStyleOneTimeLinkController(
        context: ActionContext,
        private val oneTimeTokenGenerator: OneTimeTokenGenerator)
    : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, OneTimeTokenGenerator(repositories.token))


    private val logger: Logger = LoggerFactory.getLogger(NewStyleOneTimeLinkController::class.java)

    fun getTokenForDemographicData(): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.DEMOGRAPHY, context)
    }

    fun createUserAndGetPasswordLink(): String
    {
        val user = context.postData<CreateUser>()
        userRepository.addUser(user)

        val token = getSetPasswordToken(user.username)

        emailManager.sendEmail(NewUserEmail(user, token), user)
        return objectCreation(context, "/users/${user.username}/")
    }

    fun requestResetPasswordLink(): String
    {
        val address = context.queryParams("email")
                ?: throw MissingRequiredParameterError("email")
        val user = userRepository.getMontaguUserByEmail(address)
        if (user != null)
        {
            val token = getSetPasswordToken(user.username)
            val email = PasswordSetEmail(token, user.name)
            emailManager.sendEmail(email, user)
        }
        else
        {
            logger.warn("Requested set password email for unknown user '$address'")
        }
        return okayResponse()
    }

    fun getSetPasswordToken(username: String): String
    {
        val params = mapOf(":username" to username)
        return getOneTimeLinkToken(
                OneTimeAction.SET_PASSWORD,
                username = username,
                params = params,
                duration = Duration.ofDays(1))
    }

    fun getOneTimeLinkToken(
            action: OneTimeAction,
            params: Map<String, String> = context.params(),
            username: String = context.username!!,
            duration: Duration = tokenHelper.oneTimeLinkLifeSpan
    ): String
    {
        val actionAsString = serializer.serializeEnum(action)
        val queryString = context.queryString()
        val redirectUrl = context.queryParams("redirectUrl")

        if (redirectUrl != null && !redirectUrl.isEmpty())
        {
            redirectValidator.validateRedirectUrl(redirectUrl)
        }

        val token = tokenHelper.generateOneTimeActionToken(actionAsString, params, queryString, duration, username)
        tokenRepository.storeToken(token)
        return token
    }
}