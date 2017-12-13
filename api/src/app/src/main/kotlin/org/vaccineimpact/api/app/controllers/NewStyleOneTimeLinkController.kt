package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
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
        private val oneTimeTokenGenerator: OneTimeTokenGenerator)
    : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, OneTimeTokenGenerator(repositories.token))

    fun getTokenForDemographicData(): String
    {
        val queryString = context.queryString()
        val redirectUrl = context.queryParams("redirectUrl")
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.DEMOGRAPHY,
                context.params(),
                queryString,
                redirectUrl,
                context.username!!)
    }
}

open class OneTimeTokenGenerator(
        private val tokenRepository: TokenRepository,
        private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair),
        private val serializer: Serializer = MontaguSerializer.instance,
        private val redirectValidator: RedirectValidator = RedirectValidator())
{
    open fun getOneTimeLinkToken(
            action: OneTimeAction,
            params: Map<String, String>,
            queryString: String?,
            redirectUrl: String?,
            username: String,
            duration: Duration = WebTokenHelper.oneTimeLinkLifeSpan
    ): String
    {
        val actionAsString = serializer.serializeEnum(action)

        if (redirectUrl != null && !redirectUrl.isEmpty())
        {
            redirectValidator.validateRedirectUrl(redirectUrl)
        }

        val token = tokenHelper.generateOneTimeActionToken(actionAsString, params, queryString, duration, username)
        tokenRepository.storeToken(token)
        return token
    }
}