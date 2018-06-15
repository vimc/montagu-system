package org.vaccineimpact.api.app.security

import org.pac4j.core.context.WebContext
import org.pac4j.core.credentials.TokenCredentials
import org.pac4j.core.credentials.extractor.HeaderExtractor
import org.pac4j.http.client.direct.HeaderClient
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.security.MontaguTokenAuthenticator
import org.vaccineimpact.api.security.TokenType
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.security.inflate

// This client receives the token as TokenCredentials and stores the result as JwtProfile
class JWTHeaderClient(helper: WebTokenHelper)
    : HeaderClient("Authorization", "Bearer ", MontaguTokenAuthenticator(helper, TokenType.BEARER))
{
    init
    {
        credentialsExtractor = CompressedHeaderExtractor(headerName, prefixHeader, name)
    }

    class Wrapper(helper: WebTokenHelper) : MontaguSecurityClientWrapper
    {
        override val client = JWTHeaderClient(helper)
        override val authorizationError = ErrorInfo(
                "bearer-token-invalid",
                "Bearer token not supplied in Authorization header, or bearer token was invalid"
        )
    }
}

class CompressedHeaderExtractor(headerName: String, prefixHeader: String, name: String)
    : HeaderExtractor(headerName, prefixHeader, name)
{
    override fun extract(context: WebContext?): TokenCredentials?
    {
        val wrapped = super.extract(context)
        return if (wrapped != null)
        {
            TokenCredentials(inflate(wrapped.token), wrapped.clientName)
        }
        else null
    }
}