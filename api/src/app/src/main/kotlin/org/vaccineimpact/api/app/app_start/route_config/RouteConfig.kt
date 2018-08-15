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
            GroupBurdenEstimatesRouteConfig.endpoints +
            GroupCoverageRouteConfig.endpoints +
            GroupModelRunParametersRouteConfig.endpoints +
            HomeRouteConfig.endpoints +
            ModellingGroupRouteConfig.endpoints +
            ModelRouteConfig.endpoints +
            OneTimeLinkRouteConfig.endpoints +
            PasswordRouteConfig.endpoints +
            ResponsibilityRouteConfig.endpoints +
            TouchstoneRouteConfig.endpoints +
            UserRouteConfig.endpoints
}