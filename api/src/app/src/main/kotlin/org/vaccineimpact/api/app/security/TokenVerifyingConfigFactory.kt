package org.vaccineimpact.api.app.security

import org.pac4j.core.config.Config
import org.pac4j.core.config.ConfigFactory
import org.pac4j.core.context.HttpConstants
import org.pac4j.sparkjava.DefaultHttpActionAdapter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.security.WebTokenHelper

class TokenVerifyingConfigFactory(private val tokenHelper: WebTokenHelper) : ConfigFactory
{
    override fun build() = Config(JWTHeaderClient(tokenHelper)).apply {
        httpActionAdapter = TokenActionAdapter()
    }
}

class TokenActionAdapter : DefaultHttpActionAdapter()
{
    val unauthorizedResponse: String = Serializer.toJson(Result(
            ResultStatus.FAILURE,
            null,
            listOf(ErrorInfo("bearer-token-missing", "Bearer token not supplied in Authorization header"))
    ))

    override fun adapt(code: Int, context: SparkWebContext): Any? = when (code)
    {
        HttpConstants.UNAUTHORIZED ->
        {
            context.response.contentType = "application/json"
            spark.Spark.halt(code, unauthorizedResponse)
        }
        else -> super.adapt(code, context)
    }
}