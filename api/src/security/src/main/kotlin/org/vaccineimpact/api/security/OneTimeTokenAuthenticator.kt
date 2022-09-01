package org.vaccineimpact.api.security

import com.nimbusds.jwt.JWT
import org.pac4j.core.context.WebContext
import org.pac4j.core.context.session.SessionStore
import org.pac4j.core.credentials.TokenCredentials
import org.pac4j.core.exception.CredentialsException

class OneTimeTokenAuthenticator(
        tokenHelper: WebTokenHelper,
        private val oneTimeTokenChecker: OneTimeTokenChecker
) : MontaguTokenAuthenticator(tokenHelper, TokenType.ONETIME)
{
    override fun createJwtProfile(credentials: TokenCredentials, jwt: JWT,
                                  webContext: WebContext?, sessionStore: SessionStore?)
    {
        super.createJwtProfile(credentials, jwt, webContext, sessionStore)
        checkTokenAgainstRepository(credentials)
    }

    private fun checkTokenAgainstRepository(credentials: TokenCredentials)
    {
        val compressedToken = credentials.token
        if (!oneTimeTokenChecker.checkToken(compressedToken.inflated()))
        {
            throw CredentialsException("Token has already been used (or never existed)")
        }
    }

    override fun handleUrlAttribute(credentials: TokenCredentials, jwt: JWT)
    {
        val claims = jwt.jwtClaimsSet
        val url = claims.getClaim("url")
        if (url !is String || url.isEmpty())
        {
            throw CredentialsException("No 'url' claim provided. Token is invalid")
        }
    }
}
