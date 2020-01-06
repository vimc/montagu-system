package org.vaccineimpact.api.app.security

import org.pac4j.core.authorization.generator.AuthorizationGenerator
import org.pac4j.core.context.WebContext
import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.models.permissions.PermissionSet

class MontaguAuthorizationGenerator<T : CommonProfile>(private val repositoryFactory: RepositoryFactory)
    : AuthorizationGenerator<T>
{
    override fun generate(context: WebContext?, profile: T): T
    {
        val user = repositoryFactory.inTransaction {
            it.user.getUserByUsername(profile.id)
                    .toUser(includePermissions = true)
        }
        profile.montaguPermissions = PermissionSet(user.permissions!!)
        return profile
    }
}
