package org.vaccineimpact.api.app.security

import org.vaccineimpact.api.app.MontaguRedirectValidator
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import java.time.Duration

open class OneTimeTokenGenerator(
        private val tokenRepository: TokenRepository,
        private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair),
        private val serializer: Serializer = MontaguSerializer.instance,
        private val redirectValidator: RedirectValidator = MontaguRedirectValidator())
{
    open fun getOneTimeLinkToken(
            action: OneTimeAction,
            params: Map<String, String>,
            queryString: String?,
            redirectUrl: String?,
            username: String,
            duration: Duration
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

    open fun getOneTimeLinkToken(
            action: OneTimeAction,
            context: ActionContext,
            duration: Duration = WebTokenHelper.oneTimeLinkLifeSpan
    ): String
    {
       return getOneTimeLinkToken(action,
               context.params(),
               context.queryString(),
               context.redirectUrl,
               context.username!!,
               duration)
    }
}