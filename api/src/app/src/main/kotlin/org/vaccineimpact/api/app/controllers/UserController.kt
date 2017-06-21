package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.BasicEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.models.UserDto

class UserController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/users"
    override val endpoints = listOf(
          //  BasicEndpoint("/", this::getUsers),
            SecuredEndpoint("/:username/", this::getUser, emptySet())
    )

    fun getUser(context: ActionContext): UserDto
    {
        var userName = userName(context)
        var user = repos.user().use { it.getUserByUsername(userName(context))  }
        if (user == null)
            throw UnknownObjectError(userName, "Username")

        return user
    }
//
//    fun getUsers(context: ActionContext) : Result<Record>?
//    {
//        return repos.user().use { it.getAllUsers() }
//    }

    private fun userName(context: ActionContext): String = context.params(":username")
}