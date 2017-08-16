package org.vaccineimpact.api.app.security

import org.pac4j.core.config.Config
import org.pac4j.core.config.ConfigFactory
import org.pac4j.core.context.HttpConstants
import org.pac4j.core.profile.CommonProfile
import org.pac4j.jwt.profile.JwtProfile
import org.pac4j.sparkjava.DefaultHttpActionAdapter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.DirectActionContext
import org.vaccineimpact.api.app.RequestLogger
import org.vaccineimpact.api.app.addDefaultResponseHeaders
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.repositories.AccessLogRepository
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.security.WebTokenHelper

class TokenVerifyingConfigFactory(
        tokenHelper: WebTokenHelper,
        val requiredPermissions: Set<PermissionRequirement>,
        private val accessLogRepository: () -> AccessLogRepository
) : ConfigFactory
{
    private val clients = listOf(
            JWTHeaderClient(tokenHelper)
    )

    override fun build(vararg parameters: Any?): Config
    {
        clients.forEach {
            it.addAuthorizationGenerator({ _, profile -> extractPermissionsFromToken(profile) })
        }
        return Config(clients).apply {
            setAuthorizer(MontaguAuthorizer(requiredPermissions))
            addMethodMatchers()
            httpActionAdapter = TokenActionAdapter(accessLogRepository)
        }
    }

    fun allClients() = clients.map { it::class.java.simpleName }.joinToString()

    private fun extractPermissionsFromToken(commonProfile: CommonProfile): CommonProfile
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

class TokenActionAdapter(accessLogRepository: () -> AccessLogRepository)
    : MontaguHttpActionAdapter(accessLogRepository)
{
    private val unauthorizedResponse = listOf(ErrorInfo(
            "bearer-token-invalid",
            "Bearer token not supplied in Authorization header, or bearer token was invalid"
    ))
    private fun forbiddenResponse(missingPermissions: Set<String>)
            = MissingRequiredPermissionError(missingPermissions).problems

    override fun adapt(code: Int, context: SparkWebContext): Any? = when (code)
    {
        HttpConstants.UNAUTHORIZED ->
        {
            haltWithError(code, context, unauthorizedResponse)
        }
        HttpConstants.FORBIDDEN ->
        {
            val profile = DirectActionContext(context).userProfile
            val missingPermissions = profile!!.getAttributeOrDefault(MISSING_PERMISSIONS, mutableSetOf<String>())
            val response = forbiddenResponse(missingPermissions).toList()
            haltWithError(code, context, response)
        }
        else -> super.adapt(code, context)
    }
}