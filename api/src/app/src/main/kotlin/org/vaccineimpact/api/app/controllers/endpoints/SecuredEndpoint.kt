package org.vaccineimpact.api.app.controllers.endpoints

import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.security.JWTHeaderClient
import org.vaccineimpact.api.app.security.MontaguAuthorizer
import org.vaccineimpact.api.app.security.PermissionRequirement
import org.vaccineimpact.api.app.security.TokenVerifyingConfigFactory
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Spark
import spark.route.HttpMethod

open class SecuredEndpoint<out T : Any>(
        urlFragment: String,
        route: (ActionContext) -> T,
        val permissions: Set<String>,
        method: HttpMethod = HttpMethod.get,
        additionalSetupCallback: ((String) -> Unit)? = null,
        transformer: Transformer<T>? = null
) : BasicEndpoint<T>(urlFragment, route, method, additionalSetupCallback, transformer)
{

    override fun additionalSetup(url: String, tokenHelper: WebTokenHelper)
    {
        super.additionalSetup(url, tokenHelper)
        val allPermissions = (permissions + "*/can-login").map {
            PermissionRequirement.parse(it)
        }
        val tokenVerifier = TokenVerifyingConfigFactory(tokenHelper, allPermissions.toSet()).build()
        Spark.before(url, SecurityFilter(
                tokenVerifier,
                JWTHeaderClient::class.java.simpleName,
                MontaguAuthorizer::class.java.simpleName,
                "SkipOptions"
        ))
    }
}
