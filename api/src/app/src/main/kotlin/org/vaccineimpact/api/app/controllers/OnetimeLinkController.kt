package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator

class OneTimeTokenController(context: ActionContext,
                             private val oneTimeTokenGenerator: OneTimeTokenGenerator)
    : Controller(context)
{
    constructor(context: ActionContext,
                repositories: Repositories) : this(context, OneTimeTokenGenerator(repositories.token))

    fun getToken(): String
    {
        val url = context.queryParams("url") ?: throw MissingRequiredParameterError("url")
        val profile = context.userProfile!!
        return oneTimeTokenGenerator.getOneTimeLinkToken(url, profile)
    }
}