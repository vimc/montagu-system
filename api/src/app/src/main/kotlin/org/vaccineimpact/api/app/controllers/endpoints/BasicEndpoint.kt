package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.security.WebTokenHelper
import spark.route.HttpMethod

open class BasicEndpoint(
        override val urlFragment: String,
        override val route: (ActionContext) -> Any,
        override val method: HttpMethod = HttpMethod.get,
        private val additionalSetupCallback: ((String) -> Unit)? = null
): EndpointDefinition
{
    init
    {
        if (!urlFragment.endsWith("/"))
        {
            throw Exception("All endpoint definitions must end with a forward slash: $urlFragment")
        }
    }

    override fun additionalSetup(url: String, tokenHelper: WebTokenHelper)
    {
        additionalSetupCallback?.invoke(url)
    }
}