package org.vaccineimpact.api.models

import java.sql.Timestamp

data class User(
        val properties: UserProperties,
        val permissions: List<ReifiedPermission>,
        val roles: List<ReifiedRole>
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