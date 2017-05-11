package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.BasicEndpoint
import org.vaccineimpact.api.db.Config

class HomeController(val otherEndpoints: List<String>) : AbstractController()
{
    override val urlComponent = ""
    override val endpoints = listOf(
            BasicEndpoint("/", this::index)
    )

    fun index(context: ActionContext) = Index("montagu", Config["app.version"], otherEndpoints)

    data class Index(val name: String, val version: String, val endpoints: List<String>)
}