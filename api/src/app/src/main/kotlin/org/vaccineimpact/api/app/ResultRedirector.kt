package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.security.WebTokenHelper

class ResultRedirector(
        private val tokenHelper: WebTokenHelper,
        private val repositories: Repositories,
        private val redirectValidator: RedirectValidator = MontaguRedirectValidator(),
        private val errorHandler: ErrorHandler = ErrorHandler()
)
{
    fun <T> redirectIfRequested(context: ActionContext, minimalValue: T, work: (repositories: Repositories) -> T): T
    {
        val redirectUrl = context.queryParams("redirectResultTo")
        return if (redirectUrl != null)
        {
            try
            {
                redirectValidator.validateRedirectUrl(redirectUrl)
                repositories.inTransaction { reposInSubTransaction ->
                    val data = work(reposInSubTransaction)
                    redirectWithResult(context, data.asSuccessfulResult(), redirectUrl, tokenHelper)
                }
            }
            catch (e: Exception)
            {
                val error = errorHandler.logExceptionAndReturnMontaguError(e, context.request)
                redirectWithResult(context, error.asResult(), redirectUrl, tokenHelper, e)
            }
            minimalValue
        }
        else
        {
            work(repositories)
        }
    }

    private fun redirectWithResult(
            context: ActionContext,
            result: Result,
            redirectUrl: String,
            tokenHelper: WebTokenHelper,
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
}

fun Any?.asSuccessfulResult() = Result(ResultStatus.SUCCESS, this, emptyList())