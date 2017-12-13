package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.errors.BadRequest

open class RedirectValidator
{
    @Throws(BadRequest::class)
    open fun validateRedirectUrl(redirectUrl: String)
    {
        if (!redirectUrlIsValid(redirectUrl))
        {
            throw BadRequest("Redirect url domain must be one of ${allowedDomains.joinToString()}")
        }
    }

    private fun redirectUrlIsValid(redirectUrl: String): Boolean
    {
        val validRedirectUrlPattern =
                Regex("(${allowedDomains.joinToString("|") { "($it)" }}).*")
        return validRedirectUrlPattern.matches(redirectUrl)
    }

    private val allowedDomains = arrayOf("http://localhost", "https://localhost",
            // NOTE this is our IP on production as of 12/12/2017
            "https://129.31.26.29",
            "https://support.montagu.dide.ic.ac.uk", "https://montagu.vaccineimpact.org")
}