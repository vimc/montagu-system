package org.vaccineimpact.api.app.controllers.endpoints

import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.security.JWTHeaderClient
import org.vaccineimpact.api.app.security.MontaguAuthorizer
import org.vaccineimpact.api.app.security.TokenVerifyingConfigFactory
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Spark
import spark.route.HttpMethod

class SecuredEndpoint(
        urlFragment: String,
        route: (ActionContext) -> Any,
        val permissions: List<String>,
        method: HttpMethod = HttpMethod.get,
        additionalSetupCallback: ((String) -> Unit)? = null
) : BasicEndpoint(urlFragment, route, method, additionalSetupCallback)
{

    override fun additionalSetup(url: String, tokenHelper: WebTokenHelper)
    {
        super.additionalSetup(url, tokenHelper)
        val allPermissions = permissions + "*/can-login"
        val tokenVerifier = TokenVerifyingConfigFactory(tokenHelper, allPermissions).build()
        Spark.before(url, SecurityFilter(
                tokenVerifier,
                JWTHeaderClient::class.java.simpleName,
                MontaguAuthorizer::class.java.simpleName,
                "SkipOptions"
        ))
    }
}
