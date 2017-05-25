package org.vaccineimpact.api.app

import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.profile.ProfileManager
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.security.montaguPermissions
import org.vaccineimpact.api.models.ReifiedPermission
import spark.Request
import spark.Response

open class ActionContext(private val context: SparkWebContext)
{
    private val request
            get() = context.sparkRequest
    private val response
            get() = context.sparkResponse

    constructor(request: Request, response: Response)
        : this(SparkWebContext(request, response))

    open fun contentType(): String = request.contentType()
    open fun queryParams(key: String): String? = request.queryParams(key)
    open fun params(key: String): String = request.params(key)
    open fun addResponseHeader(key: String, value: String)
    {
        response.header(key, value)
    }

    open fun hasPermission(requirement: ReifiedPermission)
            = permissions.any { requirement.satisfiedBy(it) }
    fun requirePermission(requirement: ReifiedPermission)
    {
        if (!hasPermission(requirement))
        {
            throw MissingRequiredPermissionError(setOf(requirement.toString()))
        }
    }

    val permissions by lazy {
        userProfile.montaguPermissions()
    }

    val userProfile: CommonProfile by lazy {
        val manager = ProfileManager<CommonProfile>(context)
        manager.getAll(false).single()
    }
}