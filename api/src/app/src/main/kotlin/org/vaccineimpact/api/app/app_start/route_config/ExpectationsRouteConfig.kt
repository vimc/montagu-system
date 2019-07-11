package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.ExpectationsController

object ExpectationsRouteConfig : RouteConfig
{
    private val getAllPermissions = setOf(
        "*/responsibilities.read"
    )

    private val baseUrl = "/expectations/"
    private val controller = ExpectationsController::class

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint(baseUrl, controller, "getAllExpectations")
                    .json()
                    .secure(getAllPermissions)
    )
}