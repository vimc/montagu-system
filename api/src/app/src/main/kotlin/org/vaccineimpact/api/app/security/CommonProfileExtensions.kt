package org.vaccineimpact.api.app.security

import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.security.InternalUser

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

fun CommonProfile.montaguPermissions() = this.getAttributeOrDefault(PERMISSIONS, PermissionSet())

// This will be non-null if using Basic Auth, null otherwise
fun CommonProfile.internalUser(): InternalUser?
{
    val user = this.getAttribute(USER_OBJECT)
    return if (user != null && user is InternalUser)
    {
        user
    }
    else
    {
        null
    }
}