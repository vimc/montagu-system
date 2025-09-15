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
            Endpoint("/set-cookies/", controller, "setCookies")
                    .secure()
                    .json(),
            // This endpoint just removes cookies to log the user out so there is no reason to secure it
            Endpoint("/logout/", controller, "logOut")
                    .json()
    )
}