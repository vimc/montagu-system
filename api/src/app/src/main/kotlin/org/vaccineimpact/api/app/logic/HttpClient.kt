package org.vaccineimpact.api.app.logic

import khttp.responses.Response

interface HttpClient
{
    @Throws(Exception::class)
    fun post(url: String, headers: Map<String, String>, json: Map<String, Any> = mapOf()): Response
    fun get(url: String, headers: Map<String, String>): Response
}

class KHttpClient : HttpClient
{
    override fun post(url: String, headers: Map<String, String>, json: Map<String, Any>): Response
    {
        return if (json.any())
        {
            khttp.post(url, headers, json = json)
        }
        else
        {
            khttp.post(url, headers)
        }
    }

    override fun get(url: String, headers: Map<String, String>): Response
    {
        return khttp.get(url, headers)
    }
}
