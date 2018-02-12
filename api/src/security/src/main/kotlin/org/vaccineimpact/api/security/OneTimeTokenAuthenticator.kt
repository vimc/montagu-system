package org.vaccineimpact.api.security

import com.nimbusds.jwt.JWT
import org.pac4j.core.credentials.TokenCredentials
import org.pac4j.core.exception.CredentialsException

class OneTimeTokenAuthenticator(
        tokenHelper: WebTokenHelper,
        private val oneTimeTokenChecker: OneTimeTokenChecker
) : MontaguTokenAuthenticator(tokenHelper, TokenType.ONETIME)
{
    override fun createJwtProfile(credentials: TokenCredentials, jwt: JWT)
    {
        super.createJwtProfile(credentials, jwt)
        checkTokenAgainstRepository(credentials)
    }

    private fun checkTokenAgainstRepository(credentials: TokenCredentials)
    {
        if (!oneTimeTokenChecker.checkToken(credentials.token))
        {
            throw CredentialsException("Token has already been used (or never existed)")
        }
    }

    override fun handleUrlAttribute(credentials: TokenCredentials, jwt: JWT)
    {
        val claims = jwt.jwtClaimsSet
        val url = claims.getClaim("url")
        @Suppress("UselessCallOnNotNull")
        if (url.toString().isNullOrEmpty())
        {
            throw CredentialsException("No 'url' claim provided. Token is invalid")
        }
    }
}
