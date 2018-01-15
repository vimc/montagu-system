package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.GroupModelRunParametersController
import org.vaccineimpact.api.app.controllers.NewStyleOneTimeLinkController
import org.vaccineimpact.api.app.controllers.endpoints.streamed

object GroupModelRunParametersRouteConfig : RouteConfig
{
    private val baseUrl = "/modelling-groups/:group-id/model-run-parameters/:touchstone-id"
    private val controller = GroupModelRunParametersController::class

    private val groupScope = "modelling-group:<group-id>"
    private val permissions = setOf(
            "$groupScope/estimates.write",
            "$groupScope/responsibilities.read"
    )

    override val endpoints: List<EndpointDefinition> = listOf(

            Endpoint("$baseUrl/:model-run-parameter-set-id/", controller, "getModelRunParameterSet")
                    .csv()
                    .streamed()
                    .secure(permissions),

            Endpoint("$baseUrl/", controller, "getModelRunParameterSets")
                    .json()
                    .secure(permissions),

            Endpoint("$baseUrl/", controller, "addModelRunParameters")
                    .post()
                    .json()
                    .secure(permissions),

            Endpoint("$baseUrl/get_onetime_link/",
                    NewStyleOneTimeLinkController::class, "getTokenForModelRunParameters")
                    .json()
                    .secure(permissions)
    )
}