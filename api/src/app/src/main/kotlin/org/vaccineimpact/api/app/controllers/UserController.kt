package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.UserDto
import org.vaccineimpact.api.models.UserDtoInterface
import org.vaccineimpact.api.models.permissions.ReifiedPermission

class UserController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/users"
    override val endpoints = listOf(
            //  BasicEndpoint("/", this::getUsers),
            SecuredEndpoint("/:username/", this::getUser, setOf("*/users.read"))
    )

    private val globalRoleReader = ReifiedPermission("roles.read", Scope.Global())

    fun getUser(context: ActionContext): UserDtoInterface
    {
        var userName = userName(context)

        var user =
                if (context.hasPermission(globalRoleReader))
                {
                    repos.user().use { it.getUserByUsernameWithRoles(userName(context)) }
                }
                else
                {
                    repos.user().use { it.getUserByUsername(userName(context)) }
                }

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