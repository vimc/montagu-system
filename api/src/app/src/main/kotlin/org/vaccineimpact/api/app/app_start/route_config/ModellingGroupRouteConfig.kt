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

    private val permissions = setOf("*/modelling-groups.read")

    override val endpoints = listOf(
            Endpoint("$baseUrl/", controller, "getModellingGroups")
                    .json()
                    .secure(permissions),

            Endpoint("$baseUrl/:group-id/", controller, "getModellingGroup")
                    .json()
                    .secure(permissions + setOf("*/models.read")),

            Endpoint("$baseUrl/:group-id/actions/associate_member/", controller, "modifyMembership")
                    .post()
                    .json()
                    .secure()
    )
}