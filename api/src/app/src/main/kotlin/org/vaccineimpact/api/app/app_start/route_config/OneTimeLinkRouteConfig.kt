package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.app.controllers.OneTimeLinkController
import spark.route.HttpMethod

object OneTimeLinkRouteConfig : RouteConfig
{
    private val controller = OneTimeLinkController::class
    val url = "/onetime_link/:token/"

    override val endpoints = listOf(
            Endpoint(url, controller, "onetimeLink", method = HttpMethod.get),
            Endpoint(url, controller, "onetimeLink", method = HttpMethod.post)
    )
}