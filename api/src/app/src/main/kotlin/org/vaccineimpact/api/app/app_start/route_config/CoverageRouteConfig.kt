package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.CoverageController

object CoverageRouteConfig : RouteConfig
{
    private val baseUrl = "/touchstones/:touchstone-version-id/:scenario-id/"
    private val controller = CoverageController::class

    private val permissions = setOf(
            "*/scenarios.read",
            "*/coverage.read"
    )

    private val writePermissions = setOf(
            "*/coverage.write"
    )

    override val endpoints: List<EndpointDefinition> = listOf(

            Endpoint("$baseUrl/coverage/", controller, "getCoverageDataAndMetadataForTouchstoneVersion")
                    // TODO: Return true multipart data and change the data type
                    .json().streamed()
                    .secure(permissions),

            Endpoint("$baseUrl/coverage/", controller, "getCoverageDataForTouchstoneVersion")
                    .csv().streamed()
                    .secure(permissions),

            //This route is purely for use through the portal, since different browsers will potentially send different
            //Accept headers (typically a list of formats, or just */*) which may unpredictably match either of the
            //above two routes.
            Endpoint("$baseUrl/coverage/csv/", controller, "getCoverageDataForTouchstoneVersion")
                    .csv().streamed()
                    .secure(permissions),

            Endpoint("/touchstones/:touchstone-version-id/coverage/", controller, "ingestCoverage")
                    .post()
                    .secure(writePermissions),

            Endpoint("/touchstones/:touchstone-version-id/coverage/meta/", controller, "getCoverageUploadMetadata")
                    .json()
                    .secure(writePermissions)
    )

}