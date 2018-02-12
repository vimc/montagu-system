package org.vaccineimpact.api.app.security

import org.pac4j.core.authorization.authorizer.AbstractRequireAllAuthorizer
import org.pac4j.core.context.WebContext
import org.pac4j.core.profile.CommonProfile
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.context.DirectActionContext
import org.vaccineimpact.api.models.permissions.ReifiedPermission

class MontaguAuthorizer(requiredPermissions: Set<PermissionRequirement>)
    : AbstractRequireAllAuthorizer<PermissionRequirement, CommonProfile>()
{
    init
    {
        elements = requiredPermissions
    }

    override fun check(context: WebContext, profile: CommonProfile, element: PermissionRequirement): Boolean
    {
        val profilePermissions = profile.adapted().permissions
        val reifiedRequirement = element.reify(DirectActionContext(context as SparkWebContext))

        val hasPermission = profilePermissions.any { reifiedRequirement.satisfiedBy(it) }
        if (!hasPermission)
        {
            profile.adapted().missingPermissions.add(reifiedRequirement)
        }
        return hasPermission
    }
}