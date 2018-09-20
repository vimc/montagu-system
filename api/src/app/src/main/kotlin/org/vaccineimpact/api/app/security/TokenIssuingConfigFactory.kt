package org.vaccineimpact.api.app.security

import org.pac4j.core.config.Config
import org.pac4j.core.config.ConfigFactory
import org.pac4j.core.context.HttpConstants
import org.pac4j.http.client.direct.DirectBasicAuthClient
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.models.FailedAuthentication
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import spark.Spark as spk

class TokenIssuingConfigFactory(private val repositoryFactory: RepositoryFactory,
                                private val serializer: Serializer = MontaguSerializer.instance) : ConfigFactory
{
    override fun build(vararg parameters: Any?): Config
    {
        val authClient = DirectBasicAuthClient(DatabasePasswordAuthenticator())
        return Config(authClient).apply {
            httpActionAdapter = BasicAuthActionAdapter(repositoryFactory, serializer)
            addMethodMatchers()
        }
    }
}

class BasicAuthActionAdapter(repositoryFactory: RepositoryFactory, serializer: Serializer)
    : MontaguHttpActionAdapter(repositoryFactory, serializer)
{
    private val unauthorizedResponse: String = serializer.gson.toJson(FailedAuthentication("invalid_client"))

    override fun adapt(code: Int, context: SparkWebContext): Any? = when (code)
    {
        HttpConstants.UNAUTHORIZED ->
        {
            // See https://tools.ietf.org/html/rfc6749#section-5.2
            // To comply with the spec we must return { "error": "invalid_client" }. In addition we must either:
            // 1. Just return an error 400
            // 2. Return an error 401, as well as a WWW-Authenticate: Basic header
            // If we do the later, Chrome pops up on a failed login, so we instead convert the UNAUTHORIZED (401) into
            // a BAD_REQUEST (400)
            haltWithError(HttpConstants.BAD_REQUEST, context, unauthorizedResponse)
        }
        else -> super.adapt(code, context)
    }
}
