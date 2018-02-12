package org.vaccineimpact.api.security

interface OneTimeTokenChecker
{
    /** Returns true if the token exists removes it before returning
     * This ensures tokens can only be used once. No other checks are
     * performed. **/
    fun checkOneTimeTokenExistsAndRemoveIt(token: String): Boolean
}

class NoopOneTimeTokenChecker : OneTimeTokenChecker
{
    override fun checkOneTimeTokenExistsAndRemoveIt(token: String) = true
}