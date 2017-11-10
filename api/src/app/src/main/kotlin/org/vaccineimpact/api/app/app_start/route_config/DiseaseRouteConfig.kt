package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*

object DiseaseRouteConfig : RouteConfig
{
    private val baseUrl = "/diseases/"
    private val controllerName = "Disease"

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint(baseUrl, controllerName, "getDiseases")
                    .json()
                    .transform()
                    .secure(),

            Endpoint("$baseUrl:id/", controllerName, "getDisease")
                    .json()
                    .transform()
                    .secure()
    )
}