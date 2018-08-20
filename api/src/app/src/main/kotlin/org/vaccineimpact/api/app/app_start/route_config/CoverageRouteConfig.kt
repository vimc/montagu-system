package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.CoverageController
import org.vaccineimpact.api.app.controllers.OneTimeLinkController

object CoverageRouteConfig : RouteConfig
{
    private val baseUrl = "/touchstones/:touchstone-version-id/:scenario-id/"
    private val controller = CoverageController::class

    private val permissions = setOf(
            "*/scenarios.read",
            "*/responsibilities.read",
            "*/coverage.read"
    )

    override val endpoints: List<EndpointDefinition> = listOf(

            Endpoint("$baseUrl/coverage/", controller, "getCoverageDataAndMetadataForTouchstoneVersion")
                    // TODO: Return true multipart data and change the data type
                    .json().streamed()
                    .secure(permissions),

            Endpoint("$baseUrl/coverage/", controller, "getCoverageDataForTouchstoneVersion")
                    .csv().streamed()
                    .secure(permissions),

            Endpoint("$baseUrl/coverage/csv/", controller, "getCoverageDataForTouchstoneVersion")
                    .streamed()
                    .secure(permissions)
    )

}