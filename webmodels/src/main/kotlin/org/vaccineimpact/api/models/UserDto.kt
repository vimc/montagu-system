package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.permissions.RoleAssignment
import java.sql.Timestamp

interface UserDtoInterface{
        val username: String
        val name: String
        val email: String
        val lastLoggedIn: Timestamp?
}

data class UserDto(
        override val username: String,
        override val name: String,
        override val email: String,
        override val lastLoggedIn: Timestamp?
): UserDtoInterface

data class UserWithRolesDto(
        override val username: String,
        override val name: String,
        override val email: String,
        override val lastLoggedIn: Timestamp?,
        val roles: List<RoleAssignment>
) : UserDtoInterface