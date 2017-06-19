package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.permissions.User

interface UserRepository : Repository
{
    fun getUserByEmail(email: String): User?
}