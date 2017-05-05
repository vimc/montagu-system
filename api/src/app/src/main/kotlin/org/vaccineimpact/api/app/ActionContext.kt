package org.vaccineimpact.api.app

import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.profile.ProfileManager
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.models.ReifiedPermission
import spark.Request
import spark.Response

class ActionContext(val request: Request, val response: Response)
{
    fun hasPermission(requirement: ReifiedPermission)
            = permissions.any { requirement.satisfiedBy(it) }

    val permissions by lazy {
        userProfile.permissions.map { ReifiedPermission.parse(it) }
    }

    val userProfile: CommonProfile by lazy {
        val context = SparkWebContext(request, response)
        val manager = ProfileManager<CommonProfile>(context)
        manager.getAll(false).single()
    }
}