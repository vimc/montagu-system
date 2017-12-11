package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.OneTimeLinkActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import java.time.Duration

class NewStyleOneTimeLinkController(
        context: ActionContext,
        private val repo: TokenRepository,
        private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair),
        private val serializer: Serializer = MontaguSerializer.instance,
        private val redirectValidator: RedirectValidator = RedirectValidator())
    : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.token)

    fun getTokenForDemographicData(): String
    {
        return getOneTimeLinkToken(OneTimeAction.DEMOGRAPHY)
    }

    fun getSetPasswordToken(username: String): String
    {
        return getOneTimeLinkToken(OneTimeAction.SET_PASSWORD, duration = Duration.ofDays(1))
    }

    fun getOneTimeLinkToken(
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