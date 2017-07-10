package org.vaccineimpact.api.app.security

import org.pac4j.core.config.Config
import org.pac4j.core.config.ConfigFactory
import org.pac4j.core.context.HttpConstants
import org.pac4j.http.client.direct.DirectBasicAuthClient
import org.pac4j.sparkjava.DefaultHttpActionAdapter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.addDefaultResponseHeaders
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.models.FailedAuthentication
import spark.Spark as spk

class TokenIssuingConfigFactory : ConfigFactory
{
    override fun build(vararg parameters: Any?): Config
    {
        val authClient = DirectBasicAuthClient(DatabasePasswordAuthenticator())
        return Config(authClient).apply {
            httpActionAdapter = BasicAuthActionAdapter()
            addMatcher(SkipOptionsMatcher.name, SkipOptionsMatcher)
        }
    }
}

class BasicAuthActionAdapter : DefaultHttpActionAdapter()
{
    val unauthorizedResponse: String = Serializer.instance.gson.toJson(FailedAuthentication("Bad credentials"))

    override fun adapt(code: Int, context: SparkWebContext): Any? = when (code)
    {
        HttpConstants.UNAUTHORIZED ->
        {
            context.response.addHeader("WWW-Authenticate", "Basic")
            addDefaultResponseHeaders(context.response)
            spark.Spark.halt(code, unauthorizedResponse)
        }
        else -> super.adapt(code, context)
    }
}
