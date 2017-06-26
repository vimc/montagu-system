package org.vaccineimpact.api.app.repositories

import org.jooq.Record
import org.vaccineimpact.api.db.tables.records.AppUserRecord
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.UserInterface
import org.vaccineimpact.api.models.UserWithRoles
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.security.MontaguUser

interface UserRepository : Repository
{
    fun getMontaguUserByEmail(email: String): MontaguUser?
    fun getUserByUsername(username: String): User
    fun getUserWithRolesByUsername(username: String): UserWithRoles
    fun all(): Iterable<User>
    fun alltest(): List<UserWithRoles>

    fun allWithRoles(): Iterable<UserWithRoles>
}