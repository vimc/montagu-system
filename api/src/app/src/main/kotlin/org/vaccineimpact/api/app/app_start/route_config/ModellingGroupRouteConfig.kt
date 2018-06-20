package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.app.app_start.json
import org.vaccineimpact.api.app.app_start.post
import org.vaccineimpact.api.app.app_start.secure
import org.vaccineimpact.api.app.controllers.ModellingGroupController

object ModellingGroupRouteConfig : RouteConfig
{
    private val baseUrl = "/modelling-groups"
    private val controller = ModellingGroupController::class

    private val readPermissions = setOf("*/modelling-groups.read")
    private val writePermissions = setOf("*/modelling-groups.write")

    override val endpoints = listOf(
            Endpoint("$baseUrl/", controller, "getModellingGroups")
                    .json()
                    .secure(readPermissions),
            Endpoint("$baseUrl/", controller, "createModellingGroup")
                    .json()
                    .post()
                    .secure(writePermissions),
            Endpoint("$baseUrl/:group-id/", controller, "getModellingGroup")
                    .json()
                    .secure(readPermissions + setOf("*/models.read")),
            Endpoint("$baseUrl/:group-id/actions/associate-member/", controller, "modifyMembership")
                    .post()
                    .json()
                    .secure()
    )
}