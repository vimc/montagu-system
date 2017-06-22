package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.models.User

class UserController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/users"
    override val endpoints = listOf(
            SecuredEndpoint("/:username/", this::getUser, emptySet())
    )

    fun getUser(context: ActionContext): User
    {
        var userName = userName(context)

        return repos.user().use { it.getUserByUsername(userName)  }
    }

    private fun userName(context: ActionContext): String = context.params(":username")
}