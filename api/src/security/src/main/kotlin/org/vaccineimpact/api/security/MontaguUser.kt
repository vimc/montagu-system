package org.vaccineimpact.api.security

import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import java.sql.Timestamp

typealias Username = String

data class MontaguUser(
        val properties: UserProperties,
        val roles: List<ReifiedRole>,
        val permissions: List<ReifiedPermission>
): UserPropertiesInterface by properties

interface UserPropertiesInterface {
    val username: String
    val name: String
    val email: String
    val passwordHash: String
    val salt: String
    val lastLoggedIn: Timestamp?
}

data class UserProperties(
        override val username: String,
        override val name: String,
        override val email: String,
        override val passwordHash: String,
        override val salt: String,
        override val lastLoggedIn: Timestamp?
): UserPropertiesInterface