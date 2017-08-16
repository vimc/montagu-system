package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Route
import spark.route.HttpMethod

interface EndpointDefinition<TRoute>
{
    val urlFragment: String
    val route: TRoute
    val routeWrapper: (TRoute) -> Route
    val method: HttpMethod
    val contentType: String

    fun additionalSetup(url: String, tokenHelper: WebTokenHelper, repos: Repositories)
    fun transform(x: Any): String
}

fun <TRoute> EndpointDefinition<TRoute>.getWrappedRoute(): Route
{
    return this.routeWrapper(this.route)
}