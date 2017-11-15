package org.vaccineimpact.api.blackboxTests.helpers

import com.auth0.jwt.JWT
import khttp.responses.Response
import org.assertj.core.api.Assertions

/**
 * When we request an endpoint via a onetime link, we can also request that the API
 * then redirects the client to a different URL. If it does so, it returns the result
 * of the endpoint not in the response body, but as a quey parameter in the redirect.

 * For example, if the onetime token was requested with a redirect of 'http://localhost'
 * then the client will be redirected to 'http://localhost?result=eY5435tedsgfdfg...'.
 *
 * The result is serialized to JSON, and then wrapped into a JWT. This function takes
 * a Response object (which should be the 302 redirect response) and extracts that
 * JSON result back out as String.
 */
fun Response.getResultFromRedirect(checkRedirectTarget: String? = null): String
{
    val encoded = this.getEncodedResultFromRedirect(checkRedirectTarget)
    val claims = JWT.decode(encoded)
    return claims.getClaim("result").asString()
}

private fun Response.getEncodedResultFromRedirect(checkRedirectTarget: String? = null): String
{
    val url = this.headers["Location"]
            ?: throw AssertionError("Expected response to be redirect, but it was: " + this)

    if (checkRedirectTarget != null)
    {
        Assertions.assertThat(url).startsWith(checkRedirectTarget)
    }

    val regex = Regex("""\?result=([^&]+)""")
    val match = regex.find(url)
    if (match != null)
    {
        return match.groups[1]!!.value
    }
    else
    {
        throw Exception("Unable to extract token from response URL: " + url)
    }
}