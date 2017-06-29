package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.DirectActionContext
import org.vaccineimpact.api.app.repositories.Repository
import spark.Request
import spark.Response

abstract class SingleRepositoryController<TRepo : Repository> : AbstractController()
{
    override fun wrapRoute(route: (ActionContext) -> Any): (Request, Response) -> Any
    {
        return { req: Request, res: Response ->
            DirectActionContext(req, res, repos).use { route(it) }
        }
    }
}