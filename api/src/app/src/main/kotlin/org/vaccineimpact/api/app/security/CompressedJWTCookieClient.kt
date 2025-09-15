package org.vaccineimpact.api.app.security

import org.pac4j.core.context.WebContext
import org.pac4j.core.context.session.SessionStore
import org.pac4j.core.credentials.Credentials
import org.pac4j.core.credentials.TokenCredentials
import org.pac4j.core.credentials.extractor.HeaderExtractor
import org.pac4j.http.client.direct.CookieClient
import org.pac4j.http.client.direct.HeaderClient
import org.pac4j.http.credentials.extractor.CookieExtractor
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.security.*
import java.util.*

// This client receives the token as TokenCredentials and stores the result as JwtProfile
class CompressedJWTCookieClient(helper: WebTokenHelper)
    : CookieClient(cookie.cookieName, MontaguTokenAuthenticator(helper, TokenType.BEARER))
{
    init
    {
        credentialsExtractor = CompressedCookieExtractor(cookie)
    }

    class Wrapper(helper: WebTokenHelper) : MontaguSecurityClientWrapper
    {
        override val client = CompressedJWTCookieClient(helper)
        override val authorizationError = ErrorInfo(
                "cookie-bearer-token-invalid",
                "Bearer token not supplied in cookie '${cookie.cookieName}', or bearer token was invalid"
        )
    }

    companion object
    {
        val cookie = CookieName.Main
    }
}

class CompressedCookieExtractor(cookieName: CookieName)
    : CookieExtractor(cookieName.cookieName)
{
    override fun extract(context: WebContext, sessionStore: SessionStore): Optional<Credentials>
    {
        val wrapped = super.extract(context, sessionStore)
        return if (wrapped.isPresent)
        {
            val credentials = wrapped.get() as TokenCredentials
            Optional.of(TokenCredentials(inflate(credentials.token)))
        }
        else Optional.empty()
    }
}