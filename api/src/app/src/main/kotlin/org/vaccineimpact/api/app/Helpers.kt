package org.vaccineimpact.api.app

import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.app.errors.BadRequest
import spark.Filter
import spark.Request
import spark.Response
import spark.route.HttpMethod
import javax.servlet.http.HttpServletResponse

// The idea is that as this file grows, I'll group helpers and split them off into files/classes with more
// specific aims.

fun addTrailingSlashes(req: Request, res: Response)
{
    if (!req.pathInfo().endsWith("/"))
    {
        var path = req.pathInfo() + "/"
        if (req.queryString() != null)
        {
            path += "?" + req.queryString()
        }
        res.redirect(path)
    }
}

fun addDefaultResponseHeaders(res: Response, contentType: String = "${ContentTypes.json}; charset=utf-8")
    = addDefaultResponseHeaders(res.raw(), contentType = contentType)
fun addDefaultResponseHeaders(res: HttpServletResponse, contentType: String = "${ContentTypes.json}; charset=utf-8")
{
    res.contentType = contentType
    if (res.getHeader("Content-Encoding") != "gzip")
    {
        res.addHeader("Content-Encoding", "gzip")
    }
}

class DefaultHeadersFilter(val contentType: String, val method: HttpMethod) : Filter
{
    override fun handle(request: Request, response: Response)
    {
        if (request.requestMethod().equals(method.toString(), ignoreCase = true))
        {
            addDefaultResponseHeaders(response, contentType)
        }
    }
}

fun parseParams(params: String): Map<String, String>
{
    return params.split('&')
            .map { it.split('=') }
            .associateBy({ it[0] }, { it[1] })
}

fun parseQueryParams(rawQueryParams: String?): Map<String, String>
{
    return if (rawQueryParams == null || rawQueryParams == "")
    {
        mapOf()
    }
    else
    {
        parseParams(rawQueryParams)
    }
}


open class RedirectValidator
{
    @Throws(BadRequest::class)
    open fun validateRedirectUrl(redirectUrl: String?)
    {
        if (redirectUrl == null || redirectUrl.isEmpty()
                || redirectUrlIsValid(redirectUrl))
            return

        throw BadRequest("Redirect url domain must be one of https://localhost," +
                " https://support.montagu.dide.ic.ac.uk, https://montagu.vaccineimpact.org")
    }

    private fun redirectUrlIsValid(redirectUrl: String): Boolean
    {
        val validRedirectUrlPattern =
                Regex("(https://)(montagu.vaccineimpact.org|support.montagu.dide.ic.ac.uk|localhost).*")
        return validRedirectUrlPattern.matches(redirectUrl)
    }
}