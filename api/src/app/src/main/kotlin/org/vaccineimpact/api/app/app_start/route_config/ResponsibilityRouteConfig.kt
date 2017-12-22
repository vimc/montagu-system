package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.app.app_start.EndpointDefinition
import org.vaccineimpact.api.app.app_start.json
import org.vaccineimpact.api.app.app_start.secure
import org.vaccineimpact.api.app.controllers.ResponsibilityController

object ResponsibilityRouteConfig : RouteConfig
{
    private val baseUrl = "/modelling-groups/:group-id/responsibilities"
    private val controller = ResponsibilityController::class

    private val groupScope = "modelling-group:<group-id>"
    private val permissions = setOf(
            "*/scenarios.read",
            "$groupScope/responsibilities.read"
    )

    override val endpoints: List<EndpointDefinition> = listOf(

            Endpoint("$baseUrl/", controller, "getResponsibleTouchstones")
                    .json()
                    .secure(setOf("*/touchstones.read", "$groupScope/responsibilities.read")),

            Endpoint("$baseUrl/:touchstone-id/", controller, "getResponsibilities")
                    .json()
                    .secure(permissions),

            Endpoint("$baseUrl/:touchstone-id/:scenario-id/", controller, "getResponsibility")
                    .json()
                    .secure(permissions)
    )
}