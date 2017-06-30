package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.DirectActionContext
import org.vaccineimpact.api.db.JooqContext
import spark.Route
import spark.route.HttpMethod

fun <TRepository> oneRepoEndpoint(
        urlFragment: String,
        route: (ActionContext, TRepository) -> Any,
        repository: (JooqContext) -> TRepository,
        method: HttpMethod = HttpMethod.get,
        contentType: String = ContentTypes.json
): Endpoint<(ActionContext, TRepository) -> Any>
{
    return Endpoint(
            urlFragment,
            route,
            { wrapRoute(it, repository) },
            method,
            contentType
    )
}

private fun <TRepository> wrapRoute(
        route: (ActionContext, TRepository) -> Any,
        repository: (JooqContext) -> TRepository
)
        : Route
{
    return Route({ req, res ->
        DirectActionContext(req, res).use { route(it, repository(it.db)) }
    })
}