package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.UserWithRoles
import org.vaccineimpact.api.security.MontaguUser

interface UserRepository : Repository
{
    fun getMontaguUserByEmail(email: String): MontaguUser?
    fun getUserByUsernameWithRoles(username: String): UserWithRoles
    fun getUserByUsername(username: String): User
}