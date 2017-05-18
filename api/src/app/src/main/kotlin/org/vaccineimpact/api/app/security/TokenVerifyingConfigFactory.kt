package org.vaccineimpact.api.app.security

import org.pac4j.core.config.Config
import org.pac4j.core.config.ConfigFactory
import org.pac4j.core.context.HttpConstants
import org.pac4j.core.context.WebContext
import org.pac4j.core.profile.CommonProfile
import org.pac4j.jwt.profile.JwtProfile
import org.pac4j.sparkjava.DefaultHttpActionAdapter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.app.addDefaultResponseHeaders
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.PermissionSet
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.security.WebTokenHelper

class TokenVerifyingConfigFactory(
        private val tokenHelper: WebTokenHelper,
        val requiredPermissions: Set<PermissionRequirement>
) : ConfigFactory
{
    override fun build(): Config
    {
        val client = JWTHeaderClient(tokenHelper)
        client.addAuthorizationGenerator(this::extractPermissionsFromToken)
        return Config(client).apply {
            setAuthorizer(MontaguAuthorizer(requiredPermissions))
            addMatcher(SkipOptionsMatcher.name, SkipOptionsMatcher)
            httpActionAdapter = TokenActionAdapter()
        }
    }

    private fun extractPermissionsFromToken(context: WebContext, commonProfile: CommonProfile): CommonProfile
    {
        val profile = commonProfile as JwtProfile
        val permissions = PermissionSet((profile.getAttribute("permissions") as String)
                .split(',')
                .filter { it.isNotEmpty() }
        )
        commonProfile.addAttribute(PERMISSIONS, permissions)
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

    fun forbiddenResponse(missingPermissions: Set<String>): String = Serializer.toJson(Result(
            ResultStatus.FAILURE,
            null,
            MissingRequiredPermissionError(missingPermissions).problems
    ))

    override fun adapt(code: Int, context: SparkWebContext): Any? = when (code)
    {
        HttpConstants.UNAUTHORIZED ->
        {
            addDefaultResponseHeaders(context.response)
            spark.Spark.halt(code, unauthorizedResponse)
        }
        HttpConstants.FORBIDDEN ->
        {
            addDefaultResponseHeaders(context.response)
            val profile = ActionContext(context).userProfile
            val missingPermissions = profile.getAttributeOrDefault(MISSING_PERMISSIONS, mutableSetOf<String>())
            spark.Spark.halt(code, forbiddenResponse(missingPermissions))
        }
        else -> super.adapt(code, context)
    }
}