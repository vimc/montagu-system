package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.security.WebTokenHelper
import spark.route.HttpMethod

interface EndpointDefinition<out T: Any>
{
    val urlFragment: String
    val route: (ActionContext) -> Any
    val method: HttpMethod
    fun additionalSetup(url: String, tokenHelper: WebTokenHelper)
    fun transform(x: Any): String
}