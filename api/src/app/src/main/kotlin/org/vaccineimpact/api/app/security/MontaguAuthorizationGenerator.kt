package org.vaccineimpact.api.app.security

import org.pac4j.core.authorization.generator.AuthorizationGenerator
import org.pac4j.core.context.WebContext
import org.pac4j.core.context.session.SessionStore
import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.profile.UserProfile
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.models.permissions.PermissionSet
import java.util.*

class MontaguAuthorizationGenerator(private val repositoryFactory: RepositoryFactory)
    : AuthorizationGenerator
{
    override fun generate(context: WebContext?, sessionStore: SessionStore, profile: UserProfile): Optional<UserProfile>
    {
        val user = repositoryFactory.inTransaction {
            it.user.getUserByUsername(profile.id)
                    .toUser(includePermissions = true)
        }
        (profile as CommonProfile).permissions = user.permissions!!.toSet()
        return Optional.of(profile)
    }
}
