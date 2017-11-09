package org.vaccineimpact.api.app.app_start

import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.security.PermissionRequirement
import org.vaccineimpact.api.security.WebTokenHelper
import spark.route.HttpMethod

interface EndpointDefinition
{
    val urlFragment: String
    val controllerName: String
    val actionName: String
    val method: HttpMethod
    val contentType: String
    val transform: Boolean
    val requiredPermissions: List<PermissionRequirement>

    fun additionalSetup(url: String, webTokenHelper: WebTokenHelper, repositoryFactory: RepositoryFactory)
}