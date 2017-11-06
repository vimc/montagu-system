package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.models.helpers.ContentTypes
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.DirectActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.Repository
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import spark.Route
import spark.route.HttpMethod

// This endpoint expects the handler to take two arguments: An ActionContext and
// a repository. This function expects a repository factory: A function tha takes
// a Jooq database context and returns a repository instance. This endpoint then
// takes care of instantiating the repository and passing it into the handler.
fun <TRepository : Repository> oneRepoEndpoint(
        urlFragment: String,
        route: (ActionContext, TRepository) -> Any,
        repositories: RepositoryFactory,
        repository: (Repositories) -> TRepository,
        method: HttpMethod = HttpMethod.get,
        contentType: String = ContentTypes.json
): Endpoint<(ActionContext, TRepository) -> Any>
{
    return Endpoint(
            urlFragment,
            route,
            { wrapRoute(it, repositories, repository) },
            method,
            contentType
    )
}

private fun <TRepository : Repository> wrapRoute(
        route: (ActionContext, TRepository) -> Any,
        repoFactory: RepositoryFactory,
        repository: (Repositories) -> TRepository
)
        : Route
{
    return Route({ req, res ->
        repoFactory.inTransaction { repos ->
            val repo = repository(repos)
            route(DirectActionContext(req, res), repo)
        }
    })
}