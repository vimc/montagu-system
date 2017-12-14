package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.EndpointDefinition

interface RouteConfig
{
    val endpoints: List<EndpointDefinition>
}

object MontaguRouteConfig : RouteConfig
{
    override val endpoints: List<EndpointDefinition>
            = DiseaseRouteConfig.endpoints +
            TouchstoneRouteConfig.endpoints +
            ModelRouteConfig.endpoints +
            AuthenticationRouteConfig.endpoints +
            UserRouteConfig.endpoints
}