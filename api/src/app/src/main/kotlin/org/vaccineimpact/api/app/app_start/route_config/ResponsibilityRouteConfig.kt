package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.GroupResponsibilityController

object ResponsibilityRouteConfig : RouteConfig
{
    private val baseUrl = "/modelling-groups/:group-id/responsibilities"
    private val controller = GroupResponsibilityController::class

    private val groupScope = "modelling-group:<group-id>"
    private val permissions = setOf(
            "*/scenarios.read",
            "$groupScope/responsibilities.read"
    )

    override val endpoints: List<EndpointDefinition> = listOf(

            Endpoint("$baseUrl/", controller, "getResponsibleTouchstones")
                    .json()
                    .secure(setOf("*/touchstones.read", "$groupScope/responsibilities.read")),

            Endpoint("$baseUrl/:touchstone-version-id/", controller, "getResponsibilities")
                    .json()
                    .secure(permissions),

            Endpoint("$baseUrl/:touchstone-version-id/:scenario-id/", controller, "getResponsibility")
                    .json()
                    .secure(permissions),

            Endpoint("$baseUrl/:touchstone-version-id/:scenario-id/template/", controller, "getTemplate")
                    .streamed()
                    .csv()
                    .secure(permissions)
    )
}