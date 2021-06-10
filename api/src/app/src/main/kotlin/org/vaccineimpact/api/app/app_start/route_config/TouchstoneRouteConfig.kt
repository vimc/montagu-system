package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.TouchstoneController
import org.vaccineimpact.api.app.app_start.streamed

object TouchstoneRouteConfig : RouteConfig
{
    private val baseUrl = "/touchstones/"
    private val controller = TouchstoneController::class

    private val permissions = setOf("*/touchstones.read")
    private val scenarioPermissions = permissions + setOf("*/scenarios.read")
    private val demographicPermissions = permissions + setOf("*/demographics.read")
    private val responsibilityPermissions = permissions + setOf("*/scenarios.read", "*/responsibilities.read")
    private val responsibilityReviewPermissions = permissions + setOf("*/responsibilities.review")

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint(baseUrl, controller, "getTouchstones")
                    .json()
                    .secure(permissions),

            Endpoint("$baseUrl:touchstone-version-id/responsibilities/", controller, "getResponsibilities")
                    .json()
                    .secure(responsibilityPermissions),

            Endpoint("$baseUrl:touchstone-version-id/responsibilities/comments/", controller, "getResponsibilitiesWithComments")
                    .json()
                    .secure(responsibilityReviewPermissions),

            Endpoint("$baseUrl:touchstone-version-id/responsibilities/comments/", controller, "addResponsibilityComment")
                    .post()
                    .json()
                    .secure(responsibilityReviewPermissions),

            Endpoint("$baseUrl:touchstone-version-id/scenarios/", controller, "getScenarios")
                    .json()
                    .secure(scenarioPermissions),

            Endpoint("$baseUrl:touchstone-version-id/scenarios/:scenario-id/", controller, "getScenario")
                    .json()
                    .secure(scenarioPermissions),

            Endpoint("$baseUrl:touchstone-version-id/demographics/", controller, "getDemographicDatasets")
                    .json()
                    .secure(demographicPermissions),

            Endpoint("$baseUrl:touchstone-version-id/demographics/:source-code/:type-code/", controller, "getDemographicDataAndMetadata")
                    .json().streamed()
                    .secure(demographicPermissions),

            Endpoint("$baseUrl:touchstone-version-id/demographics/:source-code/:type-code/", controller, "getDemographicData")
                    .csv().streamed()
                    .secure(demographicPermissions),

            Endpoint("$baseUrl:touchstone-version-id/demographics/:source-code/:type-code/csv/", controller, "getDemographicData")
                    .streamed()
                    .secure(demographicPermissions)
    )
}
