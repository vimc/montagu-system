package org.vaccineimpact.api.app.repositories

import org.jooq.Record
import org.jooq.Result
import org.vaccineimpact.api.models.UserDto
import org.vaccineimpact.api.models.UserWithRolesDto
import org.vaccineimpact.api.models.permissions.User

interface UserRepository : Repository
{
    fun getUserByEmail(email: String): User?
    fun getUserByUsername(username: String): UserDto?
    fun getUserByUsernameWithRoles(username: String): UserWithRolesDto?
}