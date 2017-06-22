package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.permissions.RoleAssignment
import java.sql.Timestamp

interface UserInterface{
        val username: String
        val name: String
        val email: String
        val lastLoggedIn: Timestamp?
}

data class User(
        override val username: String,
        override val name: String,
        override val email: String,
        override val lastLoggedIn: Timestamp?
): UserInterface

data class UserWithRoles(
        override val username: String,
        override val name: String,
        override val email: String,
        override val lastLoggedIn: Timestamp?,
        val roles: List<RoleAssignment>) : UserInterface
