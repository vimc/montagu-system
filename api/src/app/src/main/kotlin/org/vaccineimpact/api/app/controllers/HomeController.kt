package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.app_start.Router
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.db.Config

class HomeController(context: ActionContext) : Controller(context)
{
    constructor(context: ActionContext, @Suppress("UNUSED_PARAMETER") repositories: Repositories)
            : this(context)

    fun index() = Index("montagu", Config["app.version"], Router.urls)

    data class Index(val name: String, val version: String, val endpoints: List<String>)

    fun simulateError(): Nothing = throw Exception("An error was simulated")
}