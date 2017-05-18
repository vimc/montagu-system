package org.vaccineimpact.api.blackboxTests.helpers

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import khttp.get
import khttp.responses.Response
import org.vaccineimpact.api.models.ReifiedPermission

class RequestHelper
{
    fun get(url: String) = khttp.get(EndpointBuilder.build(url))

    fun get(url: String, permissions: Set<ReifiedPermission>): Response
    {
        val token = TestUserHelper().getTokenForTestUser(permissions)
        return get(url, token)
    }

    fun get(url: String, token: String) = get(EndpointBuilder.build(url),
            headers = mapOf("Authorization" to "Bearer $token")
    )
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