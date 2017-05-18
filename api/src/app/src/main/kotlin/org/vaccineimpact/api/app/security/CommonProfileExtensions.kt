package org.vaccineimpact.api.app.security

import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.models.PermissionSet

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

@Suppress("UNCHECKED_CAST")
fun CommonProfile.montaguPermissions() = this.attributes[PERMISSIONS] as PermissionSet