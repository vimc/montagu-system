package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.OneTimeLinkActionContext
import org.vaccineimpact.api.app.controllers.endpoints.Endpoint
import org.vaccineimpact.api.app.controllers.endpoints.multiRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.postData
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.PasswordSetEmail
import org.vaccineimpact.api.emails.getEmailManager
import spark.route.HttpMethod

class PasswordController(
        context: ControllerContext,
        val emailManager: EmailManager = getEmailManager()
) : AbstractController(context)
{
    override val urlComponent = "/password"

    override fun endpoints(repos: Repositories): List<Endpoint<*>> = listOf(
            oneRepoEndpoint("/set/", this::setPassword, repos.user, HttpMethod.post).secured(),
            multiRepoEndpoint("/request_link/", this::requestLink, repos, HttpMethod.post)
    )

    fun setPassword(context: ActionContext, repo: UserRepository): String
    {
        return setPasswordForUser(context, repo, context.username!!)
    }

    fun setPasswordForUser(context: ActionContext, repo: UserRepository, username: String): String
    {
        val password = context.postData<SetPassword>().password
        repo.setPassword(username, password)
        return okayResponse()
    }

    fun requestLink(context: ActionContext, repos: Repositories): String
    {
        repos.user().use { userRepo ->
            repos.token().use { tokenRepo ->
                val address = context.queryParams("email")
                        ?: throw MissingRequiredParameterError("email")
                val user = userRepo.getMontaguUserByEmail(address)
                if (user != null)
                {
                    val token = getSetPasswordToken(user.username, context, tokenRepo)
                    val email = PasswordSetEmail(token, user.name)
                    emailManager.sendEmail(email, user)
                }
                else
                {
                    logger.warn("Requested set password email for unknown user '$address'")
                }
                return okayResponse()
            }
        }
    }

    private fun getSetPasswordToken(username: String, context: ActionContext, repo: TokenRepository): String
    {
        val params = mapOf(":username" to username)
        val contextWithParams = OneTimeLinkActionContext(params, emptyMap(), context)
        return getOneTimeLinkToken(contextWithParams, repo, OneTimeAction.SET_PASSWORD)
    }
}