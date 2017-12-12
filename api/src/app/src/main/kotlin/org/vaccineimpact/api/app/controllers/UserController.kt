package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.OneTimeLinkActionContext
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.emails.NewUserEmail
import org.vaccineimpact.api.emails.getEmailManager
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.encompass
import org.vaccineimpact.api.models.permissions.AssociateRole
import org.vaccineimpact.api.models.permissions.RoleAssignment

class UserController(
        context: ActionContext,
        private val userRepository: UserRepository,
        private val tokenRepository: TokenRepository,
        private val emailManager: EmailManager = getEmailManager()
) : Controller(context)
{
    fun modifyUserRole(): String
    {
        val userName = userName(context)
        val associateRole = context.postData<AssociateRole>()

        val scope = if (associateRole.scopePrefix.isNullOrEmpty())
        {
            Scope.Global()
        }
        else
        {
            Scope.parse("${associateRole.scopePrefix}:${associateRole.scopeId}")
        }

        val roleWritingScopes = roleWritingScopes(context)

        if (!roleWritingScopes.any({ it.encompasses(scope) }))
        {
            throw MissingRequiredPermissionError(setOf("${scope.toString()}/roles.write"))
        }

        userRepository.modifyUserRole(userName, associateRole)
        return okayResponse()
    }

    fun getUser(): User
    {
        val userName = userName(context)
        val roleReadingScopes = roleReadingScopes(context)

        val user = userRepository.getUserByUsername(userName)
        if (roleReadingScopes.any())
        {
            val allRoles = userRepository.getRolesForUser(userName)
            val roles = filteredRoles(allRoles, roleReadingScopes)
            return user.copy(roles = roles)
        }
        else
        {
            return user
        }
    }

    fun getUsers(): List<User>
    {
        val roleReadingScopes = roleReadingScopes(context)

        if (roleReadingScopes.any())
        {
            val users = userRepository.allWithRoles().toList()

            return users.map {
                it.copy(roles = filteredRoles(it.roles, roleReadingScopes))
            }
        }
        else
        {
            return userRepository.all().toList()
        }
    }

    fun getGlobalRoles(): List<String>
    {
        return userRepository.globalRoles()
    }

    private fun userName(context: ActionContext): String = context.params(":username")

    private fun roleReadingScopes(context: ActionContext) = context.permissions
            .filter { it.name == "roles.read" }
            .map { it.scope }

    private fun roleWritingScopes(context: ActionContext) = context.permissions
            .filter { it.name == "roles.write" }
            .map { it.scope }

    private fun filteredRoles(allRoles: List<RoleAssignment>?, roleReadingScopes: Iterable<Scope>) =
            allRoles?.filter { roleReadingScopes.encompass(Scope.parse(it)) }
}