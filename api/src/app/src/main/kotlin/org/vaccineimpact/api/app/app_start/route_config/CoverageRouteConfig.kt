package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.CoverageController
import org.vaccineimpact.api.app.controllers.OneTimeLinkController

object CoverageRouteConfig : RouteConfig
{
    private val groupBaseUrl = "/modelling-groups/:group-id/responsibilities/:touchstone-version-id/:scenario-id"
    private val touchstoneBaseUrl = "/touchstones/:touchstone-version-id/:scenario-id/"
    private val controller = CoverageController::class

    private val groupScope = "modelling-group:<group-id>"
    private val groupPermissions = setOf(
            "*/scenarios.read",
            "$groupScope/responsibilities.read",
            "$groupScope/coverage.read"
    )

    private val globalPermissions = setOf(
            "*/scenarios.read",
            "*/responsibilities.read",
            "*/coverage.read"
    )

    override val endpoints: List<EndpointDefinition> = listOf(

            // group scoped

            Endpoint("$groupBaseUrl/coverage-sets/", controller, "getCoverageSetsForGroup")
                    .json()
                    .secure(groupPermissions),

            Endpoint("$groupBaseUrl/coverage/", controller, "getCoverageDataAndMetadataForGroup")
                    // TODO: Return true multipart data and change the data type
                    .json().streamed()
                    .secure(groupPermissions),

            Endpoint("$groupBaseUrl/coverage/", controller, "getCoverageDataForGroup")
                    .csv().streamed()
                    .secure(groupPermissions),

            Endpoint("$groupBaseUrl/coverage/csv/", controller, "getCoverageDataForGroup")
                    .streamed()
                    .secure(groupPermissions),

            Endpoint("$groupBaseUrl/coverage/get_onetime_link/",
                    OneTimeLinkController::class, "getTokenForCoverageData")
                    .json()
                    .secure(groupPermissions),

            // touchstone scoped

            Endpoint("$touchstoneBaseUrl/coverage/", controller, "getCoverageDataAndMetadataForTouchstoneVersion")
                    // TODO: Return true multipart data and change the data type
                    .json().streamed()
                    .secure(globalPermissions),

            Endpoint("$touchstoneBaseUrl/coverage/", controller, "getCoverageDataForTouchstoneVersion")
                    .csv().streamed()
                    .secure(globalPermissions),

            Endpoint("$touchstoneBaseUrl/coverage/csv/", controller, "getCoverageDataForTouchstoneVersion")
                    .streamed()
                    .secure(globalPermissions)
    )

}