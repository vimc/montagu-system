package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.ExpectationsController

object ExpectationsRouteConfig : RouteConfig
{
    //TODO: What role should secure this endpoint?
    private val baseUrl = "/expectations/"
    private val controller = ExpectationsController::class

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint(baseUrl, controller, "getAllExpectations")
                    .json()
                    .secure()
    )
}