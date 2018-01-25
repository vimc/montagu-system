package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.app.app_start.json
import org.vaccineimpact.api.app.controllers.HomeController

object HomeRouteConfig : RouteConfig
{
    override val endpoints = listOf(
            Endpoint("/", HomeController::class, "index")
                    .json()
    )
}