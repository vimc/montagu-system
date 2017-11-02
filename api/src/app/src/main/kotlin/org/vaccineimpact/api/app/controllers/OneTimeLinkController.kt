package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.OneTimeLink
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.errors.InvalidOneTimeLinkToken
import org.vaccineimpact.api.app.errors.MontaguError
import org.vaccineimpact.api.app.errors.UnexpectedError
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.security.WebTokenHelper
import spark.route.HttpMethod

class OneTimeLinkController(
        val context: ControllerContext,
        val controllers: MontaguControllers
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

        try
        {
            val data = link.perform(controllers, context, repos)
            return if (redirectUrl.isNullOrEmpty())
            {
                data
            }
            else
            {
                val result = Result(ResultStatus.SUCCESS, data, emptyList())
                return redirectWithResult(context, result, redirectUrl!!)
            }
        }
        catch (e: Exception)
        {
            if (redirectUrl.isNullOrEmpty())
            {
                throw e
            }

            val error = when (e)
            {
                is MontaguError -> e.asResult()
                else -> UnexpectedError().asResult()
            }

            return redirectWithResult(context, error, redirectUrl!!)
        }
    }

    private fun redirectWithResult(context: ActionContext, result: Result, redirectUrl: String)
    {
        val json = Serializer.instance.toJson(result)
        val encodedResult = tokenHelper.encodeResult(json)
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