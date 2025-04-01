package org.vaccineimpact.api.app.security

import org.pac4j.core.context.WebContext
import org.pac4j.core.context.session.SessionStore
import org.pac4j.core.credentials.Credentials
import org.pac4j.core.credentials.TokenCredentials
import org.pac4j.core.credentials.extractor.HeaderExtractor
import org.pac4j.http.client.direct.HeaderClient
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.security.MontaguTokenAuthenticator
import org.vaccineimpact.api.security.TokenType
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.security.inflate
import java.util.*

// This client receives the token as TokenCredentials and stores the result as JwtProfile
class CompressedJWTHeaderClient(helper: WebTokenHelper)
    : HeaderClient("Authorization", "Bearer ", MontaguTokenAuthenticator(helper, TokenType.BEARER))
{
    init
    {
        credentialsExtractor = CompressedHeaderExtractor(headerName, prefixHeader)
    }

    class Wrapper(helper: WebTokenHelper) : MontaguSecurityClientWrapper
    {
        override val client = CompressedJWTHeaderClient(helper)
        override val authorizationError = ErrorInfo(
                "bearer-token-invalid",
                "Bearer token not supplied in Authorization header, or bearer token was invalid"
        )
    }
}

class CompressedHeaderExtractor(headerName: String, prefixHeader: String)
    : HeaderExtractor(headerName, prefixHeader)
{
    override fun extract(context: WebContext, sessionStore: SessionStore): Optional<Credentials>
    {
        println("Extracting header")
        val wrapped = super.extract(context, sessionStore)
        return if (wrapped.isPresent)
        {
            val credentials = wrapped.get() as TokenCredentials
            Optional.of(TokenCredentials(inflate(credentials.token)))
        }
        else Optional.empty()
    }
}