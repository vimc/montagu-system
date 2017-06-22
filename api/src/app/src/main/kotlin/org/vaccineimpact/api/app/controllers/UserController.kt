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
        var user = repos.user().use { it.getUserByUsername(userName(context))  }
        if (user == null)
            throw UnknownObjectError(userName, "Username")

        return user
    }

    private fun userName(context: ActionContext): String = context.params(":username")
}