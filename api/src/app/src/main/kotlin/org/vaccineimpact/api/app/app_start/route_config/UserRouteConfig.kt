package org.vaccineimpact.api.app.app_start.route_config

import org.vaccineimpact.api.app.app_start.*
import org.vaccineimpact.api.app.controllers.AuthenticationController
import org.vaccineimpact.api.app.controllers.UserController
import spark.route.HttpMethod

object UserRouteConfig : RouteConfig
{
    private val controller = UserController::class
    private val urlBase = "/users"

    private val readRoles = setOf("*/roles.read")
    private val readUsers = setOf("*/users.read")
    private val createUsers = setOf("*/users.create")

    override val endpoints: List<EndpointDefinition> = listOf(
            Endpoint("$urlBase/roles/all/", controller, "getGlobalRoles")
                    .json()
                    .secure(readRoles),
            Endpoint("$urlBase/:username/", controller, "getUser")
                    .json()
                    .secure(readUsers),
            Endpoint(urlBase, controller, "getUsers")
                    .json()
                    .secure(readUsers),
            Endpoint(urlBase, controller, "createUser", method = HttpMethod.post)
                    .json()
                    .secure(createUsers),
            Endpoint("$urlBase/:username/actions/associate_role/", controller, "modifyUserRole", method = HttpMethod.post)
                    .json()
                    .secure(createUsers)
    )
}