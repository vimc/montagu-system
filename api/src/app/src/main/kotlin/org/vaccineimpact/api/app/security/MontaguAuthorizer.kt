package org.vaccineimpact.api.app.security

import org.pac4j.core.authorization.authorizer.RequireAllPermissionsAuthorizer
import org.pac4j.core.context.WebContext
import org.pac4j.core.profile.CommonProfile

class MontaguAuthorizer(requiredPermissions: List<String>)
    : RequireAllPermissionsAuthorizer<CommonProfile>(requiredPermissions)
{
    override fun check(context: WebContext?, profile: CommonProfile, element: String): Boolean
    {
        val hasElement = super.check(context, profile, element)
        if (!hasElement)
        {
            var missing = profile.getAttributeOrDefault(MISSING_PERMISSIONS, default = mutableSetOf<String>())
            missing.add(element)
        }
        return hasElement
    }
}