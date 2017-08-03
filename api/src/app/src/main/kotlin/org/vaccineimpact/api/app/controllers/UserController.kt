package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.postData
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.encompass
import org.vaccineimpact.api.models.permissions.RoleAssignment
import spark.route.HttpMethod

class UserController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/users"
    override fun endpoints(repos: Repositories) = listOf(
            oneRepoEndpoint("/:username/", this::getUser, repos.user).secured(setOf("*/users.read")),
            oneRepoEndpoint("/", this::getUsers, repos.user).secured(setOf("*/users.read")),
            oneRepoEndpoint("/", this::createUser, repos.user, method = HttpMethod.post).secured(setOf("*/users.create"))
    )

    fun getUser(context: ActionContext, repo: UserRepository): User
    {
        val userName = userName(context)
        val roleReadingScopes = roleReadingScopes(context)

        val user = repo.getUserByUsername(userName)
        if (roleReadingScopes.any())
        {
            val allRoles = repo.getRolesForUser(userName)
            val roles = filteredRoles(allRoles, roleReadingScopes)
            return user.copy(roles = roles)
        }
        else
        {
            return user
        }
    }

    fun getUsers(context: ActionContext, repo: UserRepository): List<User>
    {
        val roleReadingScopes = roleReadingScopes(context)

        if (roleReadingScopes.any())
        {
            val users = repo.allWithRoles().toList()

            return users.map {
                it.copy(roles = filteredRoles(it.roles, roleReadingScopes))
            }
        }
        else
        {
            return repo.all().toList()
        }
    }

    fun createUser(context: ActionContext, repo: UserRepository): String
    {
        val user = context.postData<CreateUser>()
        repo.addUser(user)
        return objectCreation(context, "/${user.username}/")
    }

    private fun userName(context: ActionContext): String = context.params(":username")

    private fun roleReadingScopes(context: ActionContext) = context.permissions
            .filter { it.name == "roles.read" }
            .map { it.scope }

    private fun filteredRoles(allRoles: List<RoleAssignment>?, roleReadingScopes: Iterable<Scope>) =
            allRoles?.filter { roleReadingScopes.encompass(Scope.parse(it)) }
}