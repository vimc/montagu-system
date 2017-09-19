package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.Endpoint
import org.vaccineimpact.api.app.controllers.endpoints.multiRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.postData
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.RepositoryFactory
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

    override fun endpoints(repos: RepositoryFactory): List<Endpoint<*>> = listOf(
            oneRepoEndpoint("/set/", this::setPassword, repos, { it.user }, HttpMethod.post).secured(),
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
        val address = context.queryParams("email")
                ?: throw MissingRequiredParameterError("email")
        val user = repos.user.getMontaguUserByEmail(address)
        if (user != null)
        {
            val token = getSetPasswordToken(user.username, context, repos.token)
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