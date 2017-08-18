package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.postData
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.PasswordSetEmail
import spark.route.HttpMethod

class PasswordController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/password"

    override fun endpoints(repos: Repositories) = listOf(
            oneRepoEndpoint("/set/", this::setPassword, repos.user, HttpMethod.post).secured(),
            oneRepoEndpoint("/request_link/", this::requestLink, repos.user, HttpMethod.post)
    )

    fun setPassword(context: ActionContext, repo: UserRepository): String
    {
        val password = context.postData<SetPassword>().password
        repo.setPassword(context.username!!, password)
        return okayResponse()
    }

    fun requestLink(context: ActionContext, repo: UserRepository): String
    {
        val address = context.queryParams("email")
                ?: throw MissingRequiredParameterError("email")
        val user = repo.getMontaguUserByEmail(address)
        if (user != null)
        {
            val email = PasswordSetEmail("TOKEN", "Full Name")
            EmailManager().sendEmail(email, user)
        }
        else
        {
            logger.warn("Requested set password email for unknown user '$address'")
        }
        return okayResponse()
    }
}