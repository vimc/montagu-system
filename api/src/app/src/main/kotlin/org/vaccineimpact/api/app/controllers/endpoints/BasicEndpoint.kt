package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.models.helpers.ContentTypes
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.DirectActionContext
import spark.Route
import spark.route.HttpMethod

// For endpoints that just need an ActionContext and nothing else
fun basicEndpoint(
        urlFragment: String,
        route: (ActionContext) -> Any,
        method: HttpMethod = HttpMethod.get,
        contentType: String = ContentTypes.json
): Endpoint<(ActionContext) -> Any>
{
    return Endpoint(
            urlFragment,
            route,
            ::basicWrapper,
            method,
            contentType
    )
}

private fun basicWrapper(route: (ActionContext) -> Any): Route
{
    return Route({ req, res -> route(DirectActionContext(req, res)) })
}