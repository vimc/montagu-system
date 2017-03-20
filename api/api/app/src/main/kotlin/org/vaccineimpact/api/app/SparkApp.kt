package org.vaccineimpact.api.app

import spark.Spark as spk

fun main(args: Array<String>)
{
    MontaguApi().run()
}

class MontaguApi
{
    private val urlBase = "/v1"
    private val jsonTransform = Serializer::toResult

    fun run()
    {
        spk.port(8080)
        spk.redirect.get("/", urlBase)
        spk.before("*", ::addTrailingSlashes)
        ErrorHandler.setup()

        spk.get("$urlBase/", { req, res -> "Hello world!" }, jsonTransform)

        spk.after("*", { req, res -> addDefaultResponseHeaders(res) })
    }
}
