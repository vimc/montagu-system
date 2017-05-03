package eden.martin.webapi.security

import org.pac4j.core.config.Config
import org.pac4j.core.config.ConfigFactory
import org.pac4j.core.context.HttpConstants
import org.pac4j.http.client.direct.DirectBasicAuthClient
import org.pac4j.sparkjava.DefaultHttpActionAdapter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.models.FailedAuthentication
import spark.Spark as spk

class TokenIssuingConfigFactory : ConfigFactory
{
    override fun build(): Config
    {
        val authClient = DirectBasicAuthClient(DatabasePasswordAuthenticator())
        val config = Config(authClient)
        config.httpActionAdapter = BasicAuthActionAdapter()
        return config
    }
}

class BasicAuthActionAdapter : DefaultHttpActionAdapter()
{
    val unauthorizedResponse: String = Serializer.gson.toJson(FailedAuthentication("Bad credentials"))

    override fun adapt(code: Int, context: SparkWebContext): Any? = when (code)
    {
        HttpConstants.UNAUTHORIZED ->
        {
            context.response.addHeader("WWW-Authenticate", "Basic")
            context.response.contentType = "application/json"
            spark.Spark.halt(code, unauthorizedResponse)
        }
        else -> super.adapt(code, context)
    }
}
