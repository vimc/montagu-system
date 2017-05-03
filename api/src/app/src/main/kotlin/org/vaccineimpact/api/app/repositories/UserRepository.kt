package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.User

interface UserRepository : Repository
{
    fun getUserByEmail(email: String): User?
}