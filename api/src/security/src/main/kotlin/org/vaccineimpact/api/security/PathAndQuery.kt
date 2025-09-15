package org.vaccineimpact.api.security

import org.apache.http.client.utils.URLEncodedUtils
import org.apache.http.message.BasicNameValuePair
import org.pac4j.core.context.WebContext
import java.net.MalformedURLException
import java.net.URI

data class PathAndQuery(val path: String, val queryParams: Map<String, String> = emptyMap())
{
    init
    {
        if ("?" in path)
        {
            throw MalformedURLException("Received this URL with query string instead of just path component: $path")
        }
    }

    fun withoutParameter(key: String) = PathAndQuery(path, queryParams - key)

    override fun toString(): String
    {
        return if (queryParams.any())
        {
            val queryString = URLEncodedUtils.format(queryParams.map { BasicNameValuePair(it.key, it.value) }, Charsets.UTF_8)
            "$path?$queryString"
        }
        else
        {
            path
        }
    }

    companion object
    {
        fun fromWebContext(context: WebContext): PathAndQuery
        {
            return PathAndQuery(context.path, context.requestParameters.mapValues { it.value[0] })
        }

        fun fromStringOrWildcard(url: String): PathAndQuery?
        {
            return if (url == "*")
            {
                null
            }
            else
            {
                val parsed = URI(url)
                val queryParams = URLEncodedUtils
                        .parse(parsed, Charsets.UTF_8)
                        .associateBy({ it.name }, { it.value })
                PathAndQuery(parsed.path, queryParams)
            }
        }
    }
}
