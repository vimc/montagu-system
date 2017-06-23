package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.UserInterface
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.RoleAssignment

class UserController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/users"
    override val endpoints = listOf(SecuredEndpoint("/:username/", this::getUser, setOf("*/users.read"))
    )

    fun getUser(context: ActionContext): UserInterface
    {
        val userName = userName(context)

        val roleReadingPermissions = context.permissions.filter { p -> p.name == "roles.read" }

        if (!roleReadingPermissions.any())
            return repos.user().use { it.getUserByUsername(userName) }

        val userWithRoles = repos.user().use { it.getUserWithRolesByUsername(userName) }

        userWithRoles.roles = userWithRoles.roles.filter { r ->
            roleReadingPermissions.any {
                p ->  p.scope.encompasses(parseScope(r))
            }
        }

        return userWithRoles
    }

    private fun parseScope(role: RoleAssignment) =
            if (role.scopePrefix.isNullOrEmpty())
            {
                Scope.Global()
            }
            else
            {
                Scope.parse("${role.scopePrefix}:${role.scopeId}")
            }

    private fun userName(context: ActionContext): String = context.params(":username")
}