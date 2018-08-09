package org.vaccineimpact.api.app.security

import org.pac4j.core.authorization.authorizer.AbstractRequireAllAuthorizer
import org.pac4j.core.context.WebContext
import org.pac4j.core.profile.CommonProfile
import org.pac4j.sparkjava.SparkWebContext
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.context.DirectActionContext
import org.vaccineimpact.api.security.PathAndQuery

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
        val claimedUrl = PathAndQuery.fromStringOrWildcard(profile.getAttribute("url") as String)
        val requestedUrl = PathAndQuery.fromWebContext(context).withoutParameter("access_token")

        return if (claimedUrl == null || requestedUrl == claimedUrl)
        {
            super.isProfileAuthorized(context, profile)
        }
        else
        {
            logger.warn("This token is issued for $claimedUrl but the current request is for $requestedUrl")
            profile.mismatchedURL = "This token is issued for $claimedUrl but the current request is for $requestedUrl"
            false
        }

    }

    override fun check(context: WebContext, profile: CommonProfile, element: PermissionRequirement): Boolean
    {
        val profilePermissions = profile.montaguPermissions
        val reifiedRequirement = element.reify(DirectActionContext(context as SparkWebContext))

        val hasPermission = profilePermissions.any { reifiedRequirement.satisfiedBy(it) }
        if (!hasPermission)
        {
            profile.missingPermissions.add(reifiedRequirement)
        }
        return hasPermission
    }
}