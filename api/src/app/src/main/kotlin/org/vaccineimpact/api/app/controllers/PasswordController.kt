package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.postData
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
import spark.route.HttpMethod

class PasswordController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/password"

    override fun endpoints(repos: Repositories) = listOf(
            oneRepoEndpoint("/set/", this::setPassword, repos.user, HttpMethod.post).secured()
    )

    fun setPassword(context: ActionContext, repo: UserRepository): String
    {
        val password = context.postData<SetPassword>().password
        repo.setPassword(context.username!!, password)
        return okayResponse()
    }
}