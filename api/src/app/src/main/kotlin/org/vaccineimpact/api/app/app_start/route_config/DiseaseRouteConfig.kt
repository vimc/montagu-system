package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.DiseaseController

object DiseaseRouteConfig : RouteConfig
{
    private val baseUrl = "/diseases/"
    private val controller = DiseaseController::class

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint(baseUrl, controller, "getDiseases")
                    .json()
                    .secure(),

            Endpoint("$baseUrl:id/", controller, "getDisease")
                    .json()
                    .secure()
    )
}