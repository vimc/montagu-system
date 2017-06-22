package org.vaccineimpact.api.app.repositories

interface UserRepository : Repository
{
    fun getUserByEmail(email: String): org.vaccineimpact.api.security.MontaguUser?
    fun getUserByUsername(username: String): org.vaccineimpact.api.models.User?
}