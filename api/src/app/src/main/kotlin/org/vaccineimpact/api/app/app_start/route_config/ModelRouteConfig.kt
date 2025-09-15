package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.ModelController

object ModelRouteConfig : RouteConfig
{
    private val baseUrl = "/models/"
    private val controller = ModelController::class
    private val readModels = setOf("*/models.read")

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint(baseUrl, controller, "getModels")
                    .json()
                    .secure(readModels),

            Endpoint("$baseUrl:id/", controller, "getModel")
                    .json()
                    .secure(readModels)
    )
}