package org.vaccineimpact.api.app.app_start

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.security.PermissionRequirement
import org.vaccineimpact.api.security.WebTokenHelper
import spark.route.HttpMethod

typealias ResultProcessor = (Any?, ActionContext) -> Any?

interface EndpointDefinition
{
    val urlFragment: String
    val controllerName: String
    val actionName: String
    val method: HttpMethod
    val contentType: String
    val postProcess: ResultProcessor
    val requiredPermissions: List<PermissionRequirement>

    fun additionalSetup(url: String, webTokenHelper: WebTokenHelper, repositoryFactory: RepositoryFactory)
}