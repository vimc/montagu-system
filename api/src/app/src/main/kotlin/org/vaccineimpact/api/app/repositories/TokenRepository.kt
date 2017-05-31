package org.vaccineimpact.api.app.repositories

interface TokenRepository : Repository
{
    /** Returns true if the token is in the database.
     * Removes it from the database before returning **/
    fun validateOneTimeToken(token: String): Boolean

    fun storeToken(token: String): Unit
}