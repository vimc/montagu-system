package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.EndpointDefinition

interface RouteConfig
{
    val endpoints: List<EndpointDefinition>
}

object MontaguRouteConfig : RouteConfig
{
    override val endpoints: List<EndpointDefinition>
            = AuthenticationRouteConfig.endpoints +
            DiseaseRouteConfig.endpoints +
            GroupCoverageRouteConfig.endpoints +
            GroupModelRunParametersRouteConfig.endpoints +
            ModelRouteConfig.endpoints +
            PasswordRouteConfig.endpoints +
            TouchstoneRouteConfig.endpoints +
            UserRouteConfig.endpoints
}