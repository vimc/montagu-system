package org.vaccineimpact.api.security

interface OneTimeTokenChecker
{
    /** Returns true if the token exists and removes it before returning.
     * This ensures tokens can only be used once. No other checks are
     * performed. **/
    fun checkToken(token: String): Boolean
}

class NoopOneTimeTokenChecker : OneTimeTokenChecker
{
    override fun checkToken(token: String) = true
}