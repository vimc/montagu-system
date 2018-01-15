package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.NewStyleOneTimeLinkController
import org.vaccineimpact.api.app.controllers.TouchstoneController
import org.vaccineimpact.api.app.app_start.streamed

object TouchstoneRouteConfig : RouteConfig
{
    private val baseUrl = "/touchstones/"
    private val controller = TouchstoneController::class

    private val permissions = setOf("*/touchstones.read")
    private val scenarioPermissions = permissions + setOf("*/scenarios.read", "*/coverage.read")
    private val demographicPermissions = permissions + setOf("*/demographics.read")

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint(baseUrl, controller, "getTouchstones")
                    .json()
                    .secure(permissions),

            Endpoint("$baseUrl:touchstone-id/scenarios/", controller, "getScenarios")
                    .json()
                    .secure(scenarioPermissions),

            Endpoint("$baseUrl:touchstone-id/scenarios/", controller, "getScenarios")
                    .json()
                    .secure(scenarioPermissions),

            Endpoint("$baseUrl:touchstone-id/scenarios/:scenario-id/", controller, "getScenario")
                    .json()
                    .secure(scenarioPermissions),

            Endpoint("$baseUrl:touchstone-id/demographics/", controller, "getDemographicDatasets")
                    .json()
                    .secure(demographicPermissions),

            Endpoint("$baseUrl:touchstone-id/demographics/:source-code/:type-code/", controller, "getDemographicDataAndMetadata")
                    .json().streamed()
                    .secure(demographicPermissions),

            Endpoint("$baseUrl:touchstone-id/demographics/:source-code/:type-code/", controller, "getDemographicData")
                    .csv().streamed()
                    .secure(demographicPermissions),

            Endpoint("$baseUrl:touchstone-id/demographics/:source-code/:type-code/get_onetime_link/",
                    NewStyleOneTimeLinkController::class, "getTokenForDemographicData")
                    .json()
                    .secure(demographicPermissions)
    )
}
