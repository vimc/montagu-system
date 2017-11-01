package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.OneTimeLink
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.errors.InvalidOneTimeLinkToken
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.TokenRepository
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
        val redirectUrl = context.queryParams("redirectUrl")
        try
        {
            val token = context.params(":token")
            val claims = verifyToken(token, repo)
            val link = OneTimeLink.parseClaims(claims)

            val result = link.perform(controllers, context, repos)
            if (redirectUrl.isNullOrEmpty())
            {
                return result
            }
            else
            {
                // TODO encode response
                val encodedResponse = ""
                return context.redirect("$redirectUrl?result=$encodedResponse")
            }
        }
        catch (e: Exception)
        {
            if (redirectUrl.isNullOrEmpty())
                throw e

            // TODO encode errorresponse
            val encodedError = ""
            return context.redirect("$redirectUrl?result=$encodedError")
        }
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