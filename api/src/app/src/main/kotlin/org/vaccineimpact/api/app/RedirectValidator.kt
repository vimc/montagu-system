package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.errors.BadRequest

open class RedirectValidator
{
    @Throws(BadRequest::class)
    open fun validateRedirectUrl(redirectUrl: String?)
    {
        if (redirectUrl == null || redirectUrl.isEmpty()
                || redirectUrlIsValid(redirectUrl))
            return

        throw BadRequest("Redirect url domain must be one of https://localhost," +
                " https://support.montagu.dide.ic.ac.uk, https://montagu.vaccineimpact.org")
    }

    private fun redirectUrlIsValid(redirectUrl: String): Boolean
    {
        val validRedirectUrlPattern =
                Regex("(https://)(montagu.vaccineimpact.org|support.montagu.dide.ic.ac.uk|localhost).*")
        return validRedirectUrlPattern.matches(redirectUrl)
    }
}