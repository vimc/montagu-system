package org.vaccineimpact.api.app.controllers

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.*
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.errors.InvalidOneTimeLinkToken
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper

class OneTimeLinkController(
        context: ActionContext,
        private val tokenRepository: TokenRepository,
        private val oneTimeTokenGenerator: OneTimeTokenGenerator,
        private val onetimeLinkResolver: OnetimeLinkResolver,
        private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair),
        private val errorHandler: ErrorHandler = ErrorHandler(),
        private val redirectValidator: RedirectValidator = MontaguRedirectValidator()
) : Controller(context)
{
    private val logger = LoggerFactory.getLogger(OneTimeLinkController::class.java)

    constructor(context: ActionContext, repositories: Repositories)
            : this(
            context,
            repositories.token,
            OneTimeTokenGenerator(repositories.token),
            OnetimeLinkResolver(repositories)
    )

    fun onetimeLink(): Any
    {
        val token = context.params(":token")
        val claims = verifyToken(token, tokenRepository)
        val link = OneTimeLink.parseClaims(claims)
        val redirectUrl = link.queryParams["redirectUrl"]

        return if (redirectUrl == null || redirectUrl.isEmpty())
        {
            onetimeLinkResolver.perform(link, context)
        }
        else
        {
            // This should never fail, as we only issue tokens for valid redirect urls,
            // but just in case
            redirectValidator.validateRedirectUrl(redirectUrl)

            try
            {
                val data = onetimeLinkResolver.perform(link, context)
                val result = Result(ResultStatus.SUCCESS, data, emptyList())
                redirectWithResult(context, result, redirectUrl)

            }
            catch (e: Exception)
            {
                val error = errorHandler.logExceptionAndReturnMontaguError(e, context.request)
                redirectWithResult(context, error.asResult(), redirectUrl, e)
            }
        }
    }

    fun getToken(): String
    {
        val url = context.queryParams("url") ?: throw MissingRequiredParameterError("url")
        val profile = context.userProfile!!
        return oneTimeTokenGenerator.getNewStyleOneTimeLinkToken(url, profile)
    }

    fun getTokenForDemographicData(): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.DEMOGRAPHY, context)
    }

    fun getTokenForCoverageData(): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.COVERAGE, context)
    }

    fun getTokenForModelRunParameters(): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.MODEl_RUN_PARAMETERS, context)
    }

    fun getTokenForCreateBurdenEstimateSet(): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.BURDENS_CREATE, context)
    }

    fun getTokenForPopulateBurdenEstimateSet(): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.BURDENS_POPULATE, context)
    }

    private fun redirectWithResult(context: ActionContext, result: Result, redirectUrl: String,
                                   exception: Exception? = null)
    {
        val encodedResult = tokenHelper.encodeResult(result)
        context.request.consumeRemainder()
        // it is recommended to keep urls under 2000 characters
        // https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers/417184#417184
        if (encodedResult.length > 1900 && exception != null)
            throw exception

        context.redirect("$redirectUrl?result=$encodedResult")
    }

    private fun verifyToken(token: String, repo: TokenRepository): Map<String, Any>
    {
        // By checking the database first, we ensure the token is
        // removed from the database, even if it fails some later check
        if (!repo.validateOneTimeToken(token))
        {
            throw InvalidOneTimeLinkToken("used", "Token has already been used (or never existed)")
        }

        val claims = try
        {
            tokenHelper.verify(token)
        }
        catch (e: Exception)
        {
            logger.warn("An error occurred validating the onetime link token: $e")
            throw InvalidOneTimeLinkToken("verification", "Unable to verify token; it may be badly formatted or signed with the wrong key")
        }
        if (claims["sub"] != WebTokenHelper.oneTimeActionSubject)
        {
            throw InvalidOneTimeLinkToken("subject", "Expected 'sub' claim to be ${WebTokenHelper.oneTimeActionSubject}")
        }
        return claims
    }
}