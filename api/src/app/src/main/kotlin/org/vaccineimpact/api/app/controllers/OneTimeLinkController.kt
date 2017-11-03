package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.ErrorHandler
import org.vaccineimpact.api.app.OneTimeLink
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.errors.InvalidOneTimeLinkToken
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.security.WebTokenHelper
import spark.route.HttpMethod

class OneTimeLinkController(
        val context: ControllerContext,
        val controllers: MontaguControllers,
        private val errorHandler: ErrorHandler = ErrorHandler(),
        private val redirectValidator: RedirectValidator = RedirectValidator()
) : AbstractController(context)
{
    override val urlComponent = ""
    val url = "/onetime_link/:token/"

    override fun endpoints(repos: RepositoryFactory) = listOf(
            oneRepoEndpoint(url, this::onetimeLink, repos, { it.token }, method = HttpMethod.get),
            oneRepoEndpoint(url, this::onetimeLink, repos, { it.token }, method = HttpMethod.post)
    )

    fun onetimeLink(context: ActionContext, repo: TokenRepository): Any
    {
        val token = context.params(":token")
        val claims = verifyToken(token, repo)
        val link = OneTimeLink.parseClaims(claims)
        val redirectUrl = link.queryParams["redirectUrl"]

        return if (redirectUrl == null || redirectUrl.isEmpty())
        {
            link.perform(controllers, context, repos)
        }
        else
        {
            // This should never fail, as we only issue tokens for valid redirect urls,
            // but just in case
            redirectValidator.validateRedirectUrl(redirectUrl)

            try
            {
                val data = link.perform(controllers, context, repos)
                val result = Result(ResultStatus.SUCCESS, data, emptyList())
                redirectWithResult(context, result, redirectUrl)

            }
            catch (e: Exception)
            {
                val error = errorHandler.logExceptionAndReturnMontaguError(e, context.request)
                redirectWithResult(context, error.asResult(), redirectUrl)
            }
        }
    }

    private fun redirectWithResult(context: ActionContext, result: Result, redirectUrl: String)
    {
        val json = Serializer.instance.toJson(result)
        val encodedResult = tokenHelper.encodeResult(json)
        return context.redirect("$redirectUrl?result=$encodedResult")
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