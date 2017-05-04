package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.security.WebTokenHelper
import spark.Request
import spark.Response
import spark.route.HttpMethod

interface EndpointDefinition
{
    val urlFragment: String
    val route: (Request, Response) -> Any
    val method: HttpMethod
    fun additionalSetup(url: String, tokenHelper: WebTokenHelper)
}