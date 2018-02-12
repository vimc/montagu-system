package org.vaccineimpact.api.app.security

import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.security.InternalUser

private const val USER_OBJECT = "userObject"
private const val MISSING_PERMISSIONS = "missingPermissions"
private const val PERMISSIONS = "montaguPermissions"
private const val MISMATCHED_URL = "mismatchedURL"

class ProfileAdapter(val profile: CommonProfile)
{
    // This will be non-null if using Basic Auth, null otherwise
    var userObject: InternalUser?
        get()
        {
            val user = profile.getAttribute(USER_OBJECT)
            return if (user != null && user is InternalUser)
            {
                user
            }
            else
            {
                null
            }
        }
        set(value) = profile.addAttribute(USER_OBJECT, value)

    val missingPermissions: MutableSet<ReifiedPermission>
        get() = profile.getAttributeOrDefault(MISSING_PERMISSIONS, default = mutableSetOf())

    var permissions: PermissionSet
        get() = profile.getAttributeOrDefault(PERMISSIONS, PermissionSet())
        set(value) = profile.addAttribute(PERMISSIONS, value)

    var mismatchedURL: String?
        get() = profile.getAttribute(MISMATCHED_URL) as String
        set(value) = profile.addAttribute(MISMATCHED_URL, value)
}


fun CommonProfile.adapted() = ProfileAdapter(this)

fun <T> CommonProfile.getAttributeOrDefault(key: String, default: T): T
{
    if (this.attributes.containsKey(key))
    {
        @Suppress("UNCHECKED_CAST")
        return this.attributes[key] as T
    }
    else
    {
        this.addAttribute(key, default)
        return default
    }
}