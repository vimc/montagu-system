package org.vaccineimpact.api.app

import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission

interface ActionContext
{
    val permissions: PermissionSet
    val userProfile: CommonProfile

    fun contentType(): String
    fun queryParams(key: String): String?
    fun params(): Map<String, String>
    fun params(key: String): String
    fun addResponseHeader(key: String, value: String): Unit

    fun hasPermission(requirement: ReifiedPermission): Boolean
    fun requirePermission(requirement: ReifiedPermission): Unit
}