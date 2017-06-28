package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.encompass

class UserController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/users"
    override val endpoints = listOf(
            SecuredEndpoint("/:username/", this::getUser, setOf("*/users.read")),
            SecuredEndpoint("/", this::getUsers, setOf("*/users.read"))
    )

    fun getUser(context: ActionContext): User
    {
        val userName = userName(context)
        val roleReadingScopes = context.permissions
                .filter { it.name == "roles.read" }
                .map { it.scope }

        val user = repos.user().use { it.getUserByUsername(userName) }
        if (roleReadingScopes.any())
        {
            val allRoles = repos.user().use { it.getRolesForUser(userName) }
            val roles = allRoles.filter { roleReadingScopes.encompass(Scope.parse(it)) }
            return user.copy(roles = roles)
        }
        else
        {
            return user
        }
    }

    fun getUsers(context: ActionContext): List<User>
    {
        return repos.user().use { it.all().toList() }
    }

    private fun userName(context: ActionContext): String = context.params(":username")
}