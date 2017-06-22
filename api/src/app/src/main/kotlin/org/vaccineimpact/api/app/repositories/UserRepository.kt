package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.UserInterface
import org.vaccineimpact.api.models.UserWithRoles
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.security.MontaguUser

interface UserRepository : Repository
{
    fun getMontaguUserByEmail(email: String): MontaguUser?
    fun getUserByUsername(username: String, permissions: PermissionSet): UserInterface
}