package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.consumeRemainder
import org.vaccineimpact.api.models.helpers.ContentTypes
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.DirectActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import spark.Route
import spark.route.HttpMethod

// This endpoint expects the handler to take two arguments: An ActionContext and
// a the Repositories collection. From there, the action is expected to instantiate
// and cleanup any repositories it needs.
fun multiRepoEndpoint(
        urlFragment: String,
        route: (ActionContext, Repositories) -> Any,
        repositoryFactory: RepositoryFactory,
        method: HttpMethod = HttpMethod.get,
        contentType: String = ContentTypes.json
): Endpoint<(ActionContext, Repositories) -> Any>
{
    return Endpoint(
            urlFragment,
            route,
            { wrapRoute(it, repositoryFactory) },
            method,
            contentType
    )
}

private fun wrapRoute(route: (ActionContext, Repositories) -> Any, repositoryFactory: RepositoryFactory): Route
{
    return Route({ req, res ->
        try
        {
            repositoryFactory.inTransaction { repos ->
                route(DirectActionContext(req, res), repos)
            }
        }
        finally
        {
            req.consumeRemainder()
        }
    })
}