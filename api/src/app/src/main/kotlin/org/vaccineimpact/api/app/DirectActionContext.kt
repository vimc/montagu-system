package org.vaccineimpact.api.app

import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.profile.ProfileManager
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.security.montaguPermissions
import org.vaccineimpact.api.db.tables.Permission
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import spark.Request
import spark.Response

open class DirectActionContext(private val context: SparkWebContext): ActionContext
{
    private val request
            get() = context.sparkRequest
    private val response
            get() = context.sparkResponse

    constructor(request: Request, response: Response)
        : this(SparkWebContext(request, response))

    override fun contentType(): String = request.contentType()
    override fun queryParams(key: String): String? = request.queryParams(key)
    override fun params(): Map<String, String> = request.params()
    override fun params(key: String): String = request.params(key)
    override fun addResponseHeader(key: String, value: String)
    {
        response.header(key, value)
    }

    override fun hasPermission(requirement: ReifiedPermission)
            = permissions.any { requirement.satisfiedBy(it) }

    override fun requirePermission(requirement: ReifiedPermission)
    {
        if (!hasPermission(requirement))
        {
            throw MissingRequiredPermissionError(setOf(requirement.toString()))
        }
    }

    override val permissions by lazy {
        userProfile.montaguPermissions()
    }

    override val userProfile: CommonProfile by lazy {
        val manager = ProfileManager<CommonProfile>(context)
        manager.getAll(false).single()
    }
}