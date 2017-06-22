package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.UserInterface
import org.vaccineimpact.api.models.permissions.ReifiedPermission

class UserController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/users"
    override val endpoints = listOf(
            SecuredEndpoint("/:username/", this::getUser, setOf("*/users.read"))
    )

    fun getUser(context: ActionContext): UserInterface
    {
        var userName = userName(context)

        return repos.user().use { it.getUserByUsername(userName, context.permissions) }
    }

    private fun userName(context: ActionContext): String = context.params(":username")
}