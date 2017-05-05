package org.vaccineimpact.api.app.security

import org.pac4j.core.config.Config
import org.pac4j.core.config.ConfigFactory
import org.pac4j.core.context.HttpConstants
import org.pac4j.core.context.WebContext
import org.pac4j.core.profile.CommonProfile
import org.pac4j.jwt.profile.JwtProfile
import org.pac4j.sparkjava.DefaultHttpActionAdapter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.security.WebTokenHelper

class TokenVerifyingConfigFactory(private val tokenHelper: WebTokenHelper, val requiredPermissions: List<String>) : ConfigFactory
{
    override fun build(): Config
    {
        val client = JWTHeaderClient(tokenHelper)
        client.addAuthorizationGenerator(this::extractPermissionsFromToken)
        return Config(client).apply {
            setAuthorizer(MontaguAuthorizer(requiredPermissions))
            httpActionAdapter = TokenActionAdapter()
        }
    }

    private fun extractPermissionsFromToken(context: WebContext, commonProfile: CommonProfile): CommonProfile
    {
        val profile = commonProfile as JwtProfile
        val permissions = (profile.getAttribute("permissions") as String)
                .split(',')
                .filter { it.isNotEmpty() }
        commonProfile.addPermissions(permissions)
        return commonProfile
    }
}

class TokenActionAdapter : DefaultHttpActionAdapter()
{
    val unauthorizedResponse: String = Serializer.toJson(Result(
            ResultStatus.FAILURE,
            null,
            listOf(ErrorInfo("bearer-token-missing", "Bearer token not supplied in Authorization header"))
    ))

    val forbiddenResponse: String = Serializer.toJson(Result(
            ResultStatus.FAILURE,
            null,
            listOf(ErrorInfo("forbidden", "You do not have sufficient permissions to access this resource"))
    ))

    override fun adapt(code: Int, context: SparkWebContext): Any? = when (code)
    {
        HttpConstants.UNAUTHORIZED ->
        {
            context.response.contentType = "application/json"
            spark.Spark.halt(code, unauthorizedResponse)
        }
        HttpConstants.FORBIDDEN ->
        {
            context.response.contentType = "application/json"
            spark.Spark.halt(code, forbiddenResponse)
        }
        else -> super.adapt(code, context)
    }
}