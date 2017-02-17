package uk.ac.imperial.vimc.demo.app

import spark.Request
import spark.Response
import java.io.FileNotFoundException
import java.net.URL

// The idea is that as this file grows, I'll group helpers and split them off into files/classes with more
// specific aims.

fun getResource(path: String): URL
{
    val url: URL? = DemoApp::class.java.classLoader.getResource(path)
    if (url != null)
    {
        return url
    } else
    {
        throw FileNotFoundException("Unable to load '$path' as a resource steam")
    }
}

fun fromFile(fileName: Any): String
{
    if (fileName is String)
    {
        try
        {
            return getResource(fileName).readText()
        } catch (e: FileNotFoundException)
        {
            return "Unknown file name '$fileName'"
        }
    } else
    {
        throw Exception("Unable to use $fileName as a file name")
    }
}

fun addTrailingSlashes(req: Request, res: Response)
{
    if (!req.pathInfo().endsWith("/"))
    {
        var path = req.pathInfo() + "/"
        if (req.queryString() != null)
        {
            path += "/?" + req.queryString()
        }
        res.redirect(path)
    }
}

fun addDefaultResponseHeaders(res: Response)
{
    res.type("application/json; charset=utf-8")
    res.header("Content-Encoding", "gzip")
}