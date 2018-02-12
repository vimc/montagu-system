package org.vaccineimpact.api.app.security

import org.pac4j.http.client.direct.HeaderClient
import org.vaccineimpact.api.security.MontaguTokenAuthenticator
import org.vaccineimpact.api.security.TokenType
import org.vaccineimpact.api.security.WebTokenHelper

// This client receives the token as TokenCredentials and stores the result as JwtProfile
class JWTHeaderClient(helper: WebTokenHelper)
    : HeaderClient(
        "Authorization",
        "Bearer ",
        MontaguTokenAuthenticator(helper, TokenType.BEARER))