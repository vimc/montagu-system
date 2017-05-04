package org.vaccineimpact.api.app.security

import org.pac4j.http.client.direct.HeaderClient
import org.pac4j.jwt.credentials.authenticator.JwtAuthenticator
import org.vaccineimpact.api.security.WebTokenHelper

private fun makeAuthenticator(helper: WebTokenHelper)
        = JwtAuthenticator(helper.signatureConfiguration)

// This client receives the token as TokenCredentials and stores the result as JwtProfile
class JWTHeaderClient(helper: WebTokenHelper)
    : HeaderClient(
        "Authorization",
        "Bearer ",
        makeAuthenticator(helper))