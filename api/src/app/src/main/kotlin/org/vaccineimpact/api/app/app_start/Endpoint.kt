package org.vaccineimpact.api.app.app_start

import org.pac4j.http.client.direct.DirectBasicAuthClient
import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.DefaultHeadersFilter
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.security.MontaguAuthorizer
import org.vaccineimpact.api.app.security.PermissionRequirement
import org.vaccineimpact.api.app.security.TokenIssuingConfigFactory
import org.vaccineimpact.api.app.security.TokenVerifyingConfigFactory
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.helpers.ContentTypes
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Spark
import spark.route.HttpMethod
import kotlin.reflect.KClass

data class Endpoint(
        override val urlFragment: String,
        override val controller: KClass<*>,
        override val actionName: String,
        override val contentType: String = ContentTypes.json,
        override val method: HttpMethod = HttpMethod.get,
        override val postProcess: ResultProcessor = ::passThrough,
        override val requiredPermissions: List<PermissionRequirement> = listOf(),
        override val basicAuth: Boolean = false

) : EndpointDefinition
{
    init
    {
        if (!urlFragment.endsWith("/"))
        {
            throw Exception("All endpoint definitions must end with a forward slash: $urlFragment")
        }
    }

    override fun additionalSetup(url: String, webTokenHelper: WebTokenHelper, repositoryFactory: RepositoryFactory)
    {
        if (requiredPermissions.any())
        {
            addSecurityFilter(url, webTokenHelper, repositoryFactory)
        }
        if (basicAuth)
        {
            setupSecurity(url, repositoryFactory)
        }

        Spark.after(url, contentType, DefaultHeadersFilter("$contentType; charset=utf-8", method))
    }

    private fun addSecurityFilter(url: String, webTokenHelper: WebTokenHelper, repositoryFactory: RepositoryFactory)
    {
        if (Config.authEnabled)
        {
            val configFactory = TokenVerifyingConfigFactory(webTokenHelper,
                    requiredPermissions.toSet(), repositoryFactory)

            val config = configFactory.build()

            Spark.before(url, org.pac4j.sparkjava.SecurityFilter(
                    config,
                    configFactory.allClients(),
                    MontaguAuthorizer::class.java.simpleName,
                    "method:$method"
            ))
        }
    }

    private fun setupSecurity(url: String, repositoryFactory: RepositoryFactory)
    {
        if (Config.authEnabled)
        {
            val config = TokenIssuingConfigFactory(repositoryFactory).build()
            Spark.before(url, SecurityFilter(
                    config,
                    DirectBasicAuthClient::class.java.simpleName,
                    null,
                    "method:${HttpMethod.post}"
            ))
        }
    }

}

fun Endpoint.secure(permissions: Set<String> = setOf()): Endpoint
{
    val allPermissions = (permissions + "*/can-login").map {
        PermissionRequirement.parse(it)
    }
    return this.copy(requiredPermissions = allPermissions)
}

// This means that the endpoint will return JSON data, and we will only respond to requests
// that say they accept application/json
fun Endpoint.json(): Endpoint
{
    return this.copy(contentType = ContentTypes.json)
}

// This means that the endpoint will return CSV data, and we will only respond to requests
// that say they accept text/csv
fun Endpoint.csv(): Endpoint
{
    return this.copy(contentType = ContentTypes.csv)
}

fun Endpoint.basicAuth(): Endpoint
{
    return this.copy(basicAuth = true)
}

fun Endpoint.post(): Endpoint
{
    return this.copy(method = spark.route.HttpMethod.post)
}

private fun passThrough(x: Any?, @Suppress("UNUSED_PARAMETER") context: ActionContext): Any? = x
