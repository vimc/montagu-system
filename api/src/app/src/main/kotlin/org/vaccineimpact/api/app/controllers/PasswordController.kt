package org.vaccineimpact.api.app.controllers

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.PasswordSetEmail
import org.vaccineimpact.api.emails.getEmailManager
import org.vaccineimpact.api.security.InternalUser
import java.time.Duration

class PasswordController(
        context: ActionContext,
        private val userRepository: UserRepository,
        private val oneTimeTokenGenerator: OneTimeTokenGenerator,
        private val emailManager: EmailManager = getEmailManager()
) : Controller(context)
{

    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.user, OneTimeTokenGenerator(repositories.token))

    private val logger = LoggerFactory.getLogger(PasswordController::class.java)

    fun setPassword(): String
    {
        return setPasswordForUser(context.username!!)
    }

    fun setPasswordForUser(username: String): String
    {
        val password = context.postData<SetPassword>().password
        logger.debug(password)
        logger.debug(username)
        userRepository.setPassword(username, password)
        return okayResponse()
    }

    fun requestResetPasswordLink(): String
    {
        val address = context.queryParams("email")
                ?: throw MissingRequiredParameterError("email")
        val internalUser = userRepository.getUserByEmail(address)
        if (internalUser != null)
        {
            val compressedToken = getCompressedSetPasswordToken(internalUser)
            val email = PasswordSetEmail(compressedToken, internalUser.name)
            emailManager.sendEmail(email, internalUser)
        }
        else
        {
            logger.warn("Requested set password email for unknown user '$address'")
        }
        return okayResponse()
    }

    private fun getCompressedSetPasswordToken(user: InternalUser): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(
                "/v1/password/set/",
                user.permissions,
                user.roles,
                user.username, Duration.ofDays(1))
    }

}