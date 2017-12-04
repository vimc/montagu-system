package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.endpoints.streamed

object TouchstoneRouteConfig : RouteConfig
{
    private val baseUrl = "/touchstones/"
    private val controllerName = "Touchstone"

    private val permissions = setOf("*/touchstones.read")
    private val scenarioPermissions = permissions + setOf("*/scenarios.read", "*/coverage.read")
    private val demographicPermissions = permissions + setOf("*/demographics.read")

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint(baseUrl, controllerName, "getTouchstones")
                    .json()
                    .secure(permissions),

            Endpoint("$baseUrl:touchstone-id/scenarios/", controllerName, "getScenarios")
                    .json()
                    .secure(scenarioPermissions),

            Endpoint("$baseUrl:touchstone-id/scenarios/", controllerName, "getScenarios")
                    .json()
                    .secure(scenarioPermissions),

            Endpoint("$baseUrl:touchstone-id/scenarios/:scenario-id/", controllerName, "getScenario")
                    .json()
                    .secure(scenarioPermissions),

            Endpoint("$baseUrl:touchstone-id/demographics/", controllerName, "getDemographicDatasets")
                    .json()
                    .secure(demographicPermissions),

            Endpoint("$baseUrl:touchstone-id/demographics/:source-code/:type-code/", controllerName, "getDemographicDataAndMetadata")
                    .json().streamed()
                    .secure(demographicPermissions),

            Endpoint("$baseUrl:touchstone-id/demographics/:source-code/:type-code/", controllerName, "getDemographicData")
                    .csv().streamed()
                    .secure(demographicPermissions),

            Endpoint("$baseUrl:touchstone-id/demographics/:source-code/:type-code/get_onetime_link/", "NewStyleOneTimeLink", "getTokenForDemographicData")
                    .json()
                    .secure(demographicPermissions)
    )
}
