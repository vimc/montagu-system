package org.vaccineimpact.api.blackboxTests.helpers

import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import khttp.get
import khttp.responses.Response

class RequestHelper
{
    fun get(url: String) = khttp.get(EndpointBuilder.build(url))

    fun get(url: String, permissions: List<String>): Response
    {
        val token = TestUserHelper().getTokenForTestUser(permissions)
        return get(url, token)
    }

    fun get(url: String, token: String) = get(EndpointBuilder.build(url),
            headers = mapOf("Authorization" to "Bearer $token")
    )

    fun getData(text: String) = parseJson(text)["data"]
    fun parseJson(text: String) = Parser().parse(StringBuilder(text)) as JsonObject
}