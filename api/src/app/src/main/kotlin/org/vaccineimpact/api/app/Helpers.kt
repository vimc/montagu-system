package org.vaccineimpact.api.app

import org.vaccineimpact.api.models.helpers.ContentTypes
import spark.Filter
import spark.Request
import spark.Response
import spark.route.HttpMethod
import java.util.concurrent.Callable
import java.util.concurrent.Future
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

fun addDefaultResponseHeaders(req: Request,
                              res: Response,
                              contentType: String = "${ContentTypes.json}; charset=utf-8") = addDefaultResponseHeaders(req, res.raw(), contentType)


fun addDefaultResponseHeaders(req: Request, res: HttpServletResponse,
                              contentType: String = "${ContentTypes.json}; charset=utf-8")
{
    res.contentType = contentType
    val gzip = req.headers("Accept-Encoding")?.contains("gzip")
    if (gzip == true && res.getHeader("Content-Encoding") != "gzip")
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
            addDefaultResponseHeaders(request, response, contentType)
        }
    }
}

// If we have a future that may return and exception this method allows
// us to await that result, examine it, and throw it if there is an exception
fun Future<Exception?>.awaitAndThrowIfError()
{
    val exception = this.get()?.cause
    if (exception != null)
    {
        throw exception
    }
}