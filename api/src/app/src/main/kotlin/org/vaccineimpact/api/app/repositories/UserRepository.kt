package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.models.AssociateUser
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.permissions.AssociateRole
import org.vaccineimpact.api.security.InternalMontaguUser

interface UserRepository : Repository
{
    fun getUserByEmail(email: String): InternalMontaguUser?
    fun getUserByUsername(username: String): InternalMontaguUser
    fun all(): Iterable<User>
    fun allWithRoles(): List<User>
    fun updateLastLoggedIn(username: String)

    fun globalRoles(): List<String>

    fun addUser(user: CreateUser)
    fun setPassword(username: String, plainPassword: String)

    fun modifyUserRole(username: String, associateRole: AssociateRole)
    fun modifyMembership(groupId: String, associateUser: AssociateUser)
}