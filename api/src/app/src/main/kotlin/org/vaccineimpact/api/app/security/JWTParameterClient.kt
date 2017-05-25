package org.vaccineimpact.api.app.security

import org.pac4j.http.client.direct.ParameterClient
import org.vaccineimpact.api.security.MontaguTokenAuthenticator
import org.vaccineimpact.api.security.WebTokenHelper

class JWTParameterClient(helper: WebTokenHelper) : ParameterClient(
        "bearer-token",
        MontaguTokenAuthenticator(helper)
)