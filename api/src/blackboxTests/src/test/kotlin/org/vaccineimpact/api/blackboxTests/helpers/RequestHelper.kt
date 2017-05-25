package org.vaccineimpact.api.blackboxTests.helpers

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import khttp.responses.Response
import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.models.ReifiedPermission

data class TokenLiteral(val value: String)
{
    override fun toString() = value
}

class RequestHelper
{
    fun get(url: String, permissions: Set<ReifiedPermission>, contentType: String = ContentTypes.json): Response
    {
        val token = TestUserHelper().getTokenForTestUser(permissions)
        return get(url, token, contentType = contentType)
    }

    fun get(url: String, token: TokenLiteral? = null, contentType: String = ContentTypes.json): Response
    {
        var headers = mapOf(
                "Accept" to contentType,
                "Accept-Encoding" to "gzip"
        )
        if (token != null)
        {
            headers += mapOf("Authorization" to "Bearer $token")
        }
        return get(url, headers)
    }

    private fun get(url: String, headers: Map<String, String>)
            = khttp.get(EndpointBuilder.build(url), headers)

    private fun defaultHeaders(contentType: String) = mapOf("Accepts" to contentType)
}

fun Response.montaguData() : JsonObject?
{
    val data = this.json()["data"]
    if (data != "")
    {
        return data as JsonObject
    }
    else
    {
        return null
    }
}
@Suppress("UNCHECKED_CAST")
fun Response.montaguDataAsArray() = this.json()["data"] as JsonArray<JsonObject>
fun Response.json() = Parser().parse(StringBuilder(text)) as JsonObject