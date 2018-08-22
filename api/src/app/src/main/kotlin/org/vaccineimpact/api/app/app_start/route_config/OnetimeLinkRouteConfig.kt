package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.app.app_start.secure
import org.vaccineimpact.api.app.controllers.OneTimeTokenController

object OneTimeLinkRouteConfig : RouteConfig
{
    private val controller = OneTimeTokenController::class
    val url = "/onetime_link/:token/"

    override val endpoints = listOf(
            // This gets new style onetime tokens (like the reporting API)
            Endpoint("/onetime_token/", controller, "getToken")
                    .secure()
    )
}