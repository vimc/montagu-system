package org.vaccineimpact.api.app.security

import org.pac4j.core.authorization.authorizer.AbstractRequireAllAuthorizer
import org.pac4j.core.context.WebContext
import org.pac4j.core.profile.CommonProfile
import org.pac4j.sparkjava.SparkWebContext
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.context.DirectActionContext

class MontaguAuthorizer(requiredPermissions: Set<PermissionRequirement>)
    : AbstractRequireAllAuthorizer<PermissionRequirement, CommonProfile>()
{
    init
    {
        elements = requiredPermissions
    }

    private val logger = LoggerFactory.getLogger(MontaguAuthorizer::class.java)

    override fun isProfileAuthorized(context: WebContext, profile: CommonProfile): Boolean
    {
        val claimedUrl = profile.getAttribute("url")
        val requestedUrl = context.path

        if (claimedUrl == "*" || requestedUrl == claimedUrl)
        {
            return super.isProfileAuthorized(context, profile)
        }
        else
        {
            logger.warn("This token is issued for $claimedUrl but the current request is for $requestedUrl")
            profile.adapted().mismatchedURL = "This token is issued for $claimedUrl but the current request is for $requestedUrl"
            return false
        }

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