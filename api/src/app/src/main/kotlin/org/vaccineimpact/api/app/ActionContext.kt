package org.vaccineimpact.api.app

import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission

interface ActionContext
{
    val permissions: PermissionSet
    val userProfile: CommonProfile?
    /** If the user logged in with a token this will be their username
     *  Otherwise it is null
     */
    val username: String?

    fun contentType(): String

    fun queryParams(key: String): String?
    fun queryString(): String?
    fun params(): Map<String, String>
    fun params(key: String): String
    fun <T: Any> postData(klass: Class<T>): T

    fun addResponseHeader(key: String, value: String): Unit
    fun addAttachmentHeader(filename: String): Unit
    fun setResponseStatus(status: Int): Unit

    fun hasPermission(requirement: ReifiedPermission): Boolean
    fun requirePermission(requirement: ReifiedPermission): Unit
}

inline fun <reified T: Any> ActionContext.postData() = this.postData(T::class.java)