package org.vaccineimpact.api.app.controllers.endpoints

import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.app.security.*
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Spark
import spark.route.HttpMethod

open class SecuredEndpoint(
        urlFragment: String,
        route: (ActionContext) -> Any,
        val permissions: Set<String>,
        method: HttpMethod = HttpMethod.get,
        contentType: String = ContentTypes.json,
        additionalSetupCallback: ((String) -> Unit)? = null
) : BasicEndpoint(urlFragment, route, method, contentType, additionalSetupCallback)
{

    override fun additionalSetup(url: String, tokenHelper: WebTokenHelper)
    {
        super.additionalSetup(url, tokenHelper)
        val allPermissions = (permissions + "*/can-login").map {
            PermissionRequirement.parse(it)
        }
        val configFactory = TokenVerifyingConfigFactory(tokenHelper, allPermissions.toSet())
        val tokenVerifier = configFactory.build()
        Spark.before(url, SecurityFilter(
                tokenVerifier,
                configFactory.allClients(),
                MontaguAuthorizer::class.java.simpleName,
                "SkipOptions"
        ))
    }
}
