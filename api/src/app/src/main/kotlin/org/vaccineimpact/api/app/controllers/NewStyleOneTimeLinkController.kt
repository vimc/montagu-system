package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.WebTokenHelper
import java.time.Duration

class NewStyleOneTimeLinkController(
        context: ActionContext,
        private val repo: TokenRepository,
        private val tokenHelper: WebTokenHelper,
        private val redirectValidator: RedirectValidator = RedirectValidator())
    : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories, tokenHelper: WebTokenHelper)
            : this(context, repositories.token, tokenHelper)

    val serializer = context.serializer

    fun getTokenForDemographicData(): String
    {
        return getOneTimeLinkToken(context, repo, OneTimeAction.DEMOGRAPHY)
    }

    private fun getOneTimeLinkToken(
            context: ActionContext,
            repo: TokenRepository,
            action: OneTimeAction,
            duration: Duration = tokenHelper.oneTimeLinkLifeSpan
    ): String
    {
        val actionAsString = serializer.serializeEnum(action)
        val params = context.params()
        val queryString = context.queryString()
        val redirectUrl = context.queryParams("redirectUrl")

        if (redirectUrl != null && !redirectUrl.isEmpty())
        {
            redirectValidator.validateRedirectUrl(redirectUrl)
        }

        val token = tokenHelper.generateOneTimeActionToken(actionAsString, params, queryString, duration, context.username!!)
        repo.storeToken(token)
        return token
    }
}