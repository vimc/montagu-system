package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.db.tables.Role
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.encompass
import org.vaccineimpact.api.models.permissions.RoleAssignment

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
        val roleReadingScopes = roleReadingScopes(context)

        val user = repos.user().use { it.getUserByUsername(userName) }
        if (roleReadingScopes.any())
        {
            val allRoles = repos.user().use { it.getRolesForUser(userName) }
            val roles = filteredRoles(allRoles, roleReadingScopes)
            return user.copy(roles = roles)
        }
        else
        {
            return user
        }
    }

    fun getUsers(context: ActionContext): List<User>
    {
        val roleReadingScopes = roleReadingScopes(context)

        if (roleReadingScopes.any())
        {
            val users = repos.user().use { it.allWithRoles().toList() }

            return users.map {
                u ->
                u.copy(roles = filteredRoles(u.roles, roleReadingScopes))
            }
        }
        else
        {
            return repos.user().use { it.all().toList() }
        }

    }

    private fun userName(context: ActionContext): String = context.params(":username")

    private fun roleReadingScopes(context: ActionContext) = context.permissions
            .filter { it.name == "roles.read" }
            .map { it.scope }

    private fun filteredRoles(allRoles: List<RoleAssignment>?, roleReadingScopes: Iterable<Scope>) =
            allRoles?.filter { roleReadingScopes.encompass(Scope.parse(it)) }
}