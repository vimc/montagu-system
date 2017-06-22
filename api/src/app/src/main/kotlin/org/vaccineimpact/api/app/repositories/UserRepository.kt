package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.UserWithRoles
import org.vaccineimpact.api.security.MontaguUser

interface UserRepository : Repository
{
    fun getUserByEmail(email: String): MontaguUser?
    fun getUserByUsername(username: String): User?
    fun getUserByUsernameWithRoles(username: String): UserWithRoles?
}