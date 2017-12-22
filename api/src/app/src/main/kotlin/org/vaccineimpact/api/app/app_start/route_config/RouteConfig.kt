package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.EndpointDefinition

interface RouteConfig
{
    val endpoints: List<EndpointDefinition>
}

object MontaguRouteConfig : RouteConfig
{
    // Keep these alphabetically sorted
    override val endpoints: List<EndpointDefinition>
            = AuthenticationRouteConfig.endpoints +
            DiseaseRouteConfig.endpoints +
            GroupCoverageRouteConfig.endpoints +
            GroupModelRunParametersRouteConfig.endpoints +
            ModellingGroupRouteConfig.endpoints +
            ModelRouteConfig.endpoints +
            PasswordRouteConfig.endpoints +
            ResponsibilityRouteConfig.endpoints +
            TouchstoneRouteConfig.endpoints +
            UserRouteConfig.endpoints
}