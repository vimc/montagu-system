package org.vaccineimpact.api.app.controllers.endpoints

import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.security.MontaguAuthorizer
import org.vaccineimpact.api.app.security.PermissionRequirement
import org.vaccineimpact.api.app.security.TokenVerifyingConfigFactory
import spark.Spark

// Adds an additional setup step to adding this endpoint. This additional
// steps checks the user has a valid token and has all the required permissions
fun <TRoute> Endpoint<TRoute>.secured(permissions: Set<String> = emptySet()): Endpoint<TRoute>
{
    return this.withAdditionalSetup({ url, tokenHelper ->
        val allPermissions = (permissions + "*/can-login").map {
            PermissionRequirement.parse(it)
        }
        val configFactory = TokenVerifyingConfigFactory(tokenHelper, allPermissions.toSet())
        val tokenVerifier = configFactory.build()
        Spark.before(url, SecurityFilter(
                tokenVerifier,
                configFactory.allClients(),
                MontaguAuthorizer::class.java.simpleName,
                "method:$method"
        ))
    })
}