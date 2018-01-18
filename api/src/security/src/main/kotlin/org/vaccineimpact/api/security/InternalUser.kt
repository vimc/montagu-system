package org.vaccineimpact.api.security

import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.models.permissions.RoleAssignment
import java.beans.ConstructorProperties
import java.time.Instant

data class InternalUser(
        val properties: UserProperties,
        val roles: List<ReifiedRole>,
        val permissions: List<ReifiedPermission>
): UserPropertiesInterface by properties
{
    fun toUser(): User
    {
        return User(this.username, this.name, this.email, this.lastLoggedIn, this.roles.map{ RoleAssignment(it) })
    }
}

interface BasicUserProperties
{
    val username: String
    val name: String
    val email: String
}

interface UserPropertiesInterface : BasicUserProperties
{
    val passwordHash: String?
    val lastLoggedIn: Instant?
}

data class UserProperties
@ConstructorProperties("username", "name", "email", "passwordHash", "lastLoggedIn")
constructor(
        override val username: String,
        override val name: String,
        override val email: String,
        override val passwordHash: String?,
        override val lastLoggedIn: Instant?
): UserPropertiesInterface