package org.vaccineimpact.api.app.security

import org.pac4j.http.client.direct.ParameterClient
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.security.OneTimeTokenAuthenticator
import org.vaccineimpact.api.security.OneTimeTokenChecker
import org.vaccineimpact.api.security.WebTokenHelper

// This client receives the token as TokenCredentials and stores the result as JwtProfile
class JWTParameterClient(helper: WebTokenHelper, oneTimeTokenChecker: OneTimeTokenChecker)
    : ParameterClient("access_token", OneTimeTokenAuthenticator(helper, oneTimeTokenChecker))
{
    init
    {
        @Suppress("UsePropertyAccessSyntax")
        this.setSupportGetRequest(true)
    }

    class Wrapper(helper: WebTokenHelper, oneTimeTokenChecker: OneTimeTokenChecker): MontaguSecurityClientWrapper
    {
        override val client = JWTParameterClient(helper, oneTimeTokenChecker)
        override val authorizationError = ErrorInfo(
                "onetime-token-invalid",
                "Onetime token not supplied, or onetime token was invalid"
        )
    }
}