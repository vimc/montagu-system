package org.vaccineimpact.api.app.security

import org.pac4j.core.config.Config
import org.pac4j.core.config.ConfigFactory
import org.pac4j.core.context.HttpConstants
import org.pac4j.core.profile.CommonProfile
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.context.DirectActionContext
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.security.WebTokenHelper

class TokenVerifyingConfigFactory(
        tokenHelper: WebTokenHelper,
        private val requiredPermissions: Set<PermissionRequirement>,
        private val repositoryFactory: RepositoryFactory
) : ConfigFactory
{
    private val wrappedClients: List<MontaguSecurityClientWrapper> = listOf(
            JWTHeaderClient.Wrapper(tokenHelper),
            JWTParameterClient.Wrapper(tokenHelper, JooqOneTimeTokenChecker(repositoryFactory))
    )
    private val clients = wrappedClients.map { it.client }

    override fun build(vararg parameters: Any?): Config
    {
        clients.forEach {
            it.addAuthorizationGenerator({ _, profile -> extractPermissionsFromToken(profile) })
        }
        return Config(clients).apply {
            setAuthorizer(MontaguAuthorizer(requiredPermissions))
            addMethodMatchers()
            httpActionAdapter = TokenActionAdapter(wrappedClients, repositoryFactory)
        }
    }

    fun allClients() = clients.joinToString { it::class.java.simpleName }

    private fun extractPermissionsFromToken(profile: CommonProfile): CommonProfile
    {
        // "permissions" will exists as an attribute because profile is a JwtProfile
        val permissions = PermissionSet((profile.getAttribute("permissions") as String)
                .split(',')
                .filter { it.isNotEmpty() }
        )
        profile.montaguPermissions = permissions
        return profile
    }
}

class TokenActionAdapter(wrappedClients: List<MontaguSecurityClientWrapper>, repositoryFactory: RepositoryFactory)
    : MontaguHttpActionAdapter(repositoryFactory)
{
    private val unauthorizedResponse: List<ErrorInfo> = wrappedClients.map { it.authorizationError }

    private fun forbiddenResponse(missingPermissions: Set<ReifiedPermission>, mismatchedURL: String?): List<ErrorInfo>
    {
        val errors = mutableListOf<ErrorInfo>()
        if (missingPermissions.any())
        {
            errors.addAll(MissingRequiredPermissionError(missingPermissions).problems)
        }
        if (mismatchedURL != null)
        {
            errors.add(ErrorInfo("forbidden", mismatchedURL))
        }
        return errors
    }

    override fun adapt(code: Int, context: SparkWebContext): Any? = when (code)
    {
        HttpConstants.UNAUTHORIZED ->
        {
            haltWithError(code, context, unauthorizedResponse)
        }
        HttpConstants.FORBIDDEN ->
        {
            val profile = DirectActionContext(context).userProfile!!
            haltWithError(code, context, forbiddenResponse(profile.missingPermissions, profile.mismatchedURL))
        }
        else -> super.adapt(code, context)
    }
}