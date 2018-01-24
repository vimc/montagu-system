package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.AuthenticationController
import spark.route.HttpMethod

object AuthenticationRouteConfig : RouteConfig
{
    private val controller = AuthenticationController::class

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint("/authenticate/", controller, "authenticate", method = HttpMethod.post)
                    .json()
                    .basicAuth(),
            Endpoint("/set-shiny-cookie/", controller, "setShinyCookie")
                    .secure()
                    .json(),
            // This endpoint just removes a cookie, to log the user out of the shiny apps
            // so there is no reason to secure it.
            Endpoint("/clear-shiny-cookie/", controller, "clearShinyCookie")
                    .json()
    )
}