package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.BurdenEstimates.BurdenEstimateUploadController
import org.vaccineimpact.api.app.controllers.BurdenEstimates.BurdenEstimatesController
import spark.route.HttpMethod

object BurdenEstimatesRouteConfig : RouteConfig
{
    private val baseUrl = "/modelling-groups/:group-id/responsibilities/:touchstone-version-id/:scenario-id/estimate-sets"
    private val controller = BurdenEstimatesController::class
    private val uploadController = BurdenEstimateUploadController::class

    private val groupScope = "modelling-group:<group-id>"
    private val readPermissions = setOf(
            "$groupScope/estimates.read",
            "$groupScope/responsibilities.read"
    )
    private val writePermissions = setOf(
            "$groupScope/estimates.write",
            "$groupScope/responsibilities.read"
    )

    override val endpoints = listOf(
            // Get and create sets
            Endpoint("$baseUrl/", controller, "getBurdenEstimates")
                    .json()
                    .secure(readPermissions),

            Endpoint("$baseUrl/", controller, "createBurdenEstimateSet", method = HttpMethod.post)
                    .json()
                    .secure(writePermissions),

            //Get set metadata
            Endpoint("$baseUrl/:set-id/", controller, "getBurdenEstimateSet")
                    .json()
                    .secure(readPermissions),

            //Get set data
            Endpoint("$baseUrl/:set-id/estimates/", controller, "getBurdenEstimateSetData")
                    .csv()
                    .streamed()
                    .secure(readPermissions),

            // Populate sets
            Endpoint("$baseUrl/:set-id/actions/request-upload/", uploadController, "getUploadToken", method = HttpMethod.get)
                    .json()
                    .secure(writePermissions),

            Endpoint("$baseUrl/:set-id/actions/upload/:token/", uploadController, "uploadBurdenEstimateFile", method = HttpMethod.post)
                    .json()
                    .secure(writePermissions),

            Endpoint("$baseUrl/:set-id/actions/populate/:token/", uploadController, "populateBurdenEstimateSetFromLocalFile", method = HttpMethod.post)
                    .json()
                    .secure(writePermissions),

            Endpoint("$baseUrl/:set-id/", uploadController, "populateBurdenEstimateSet", method = HttpMethod.post)
                    .json()
                    .secure(writePermissions),
            // Actions
            Endpoint("$baseUrl/:set-id/actions/clear/",
                    controller, "clearBurdenEstimateSet", method = HttpMethod.post)
                    .json()
                    .secure(writePermissions),

            Endpoint("$baseUrl/:set-id/actions/close/",
                    controller, "closeBurdenEstimateSet", method = HttpMethod.post)
                    .json()
                    .secure(writePermissions),

            Endpoint("$baseUrl/:set-id/estimates/:outcome-code/",
                    controller, "getEstimatesForOutcome")
                    .json()
                    .secure(readPermissions)
    )
}