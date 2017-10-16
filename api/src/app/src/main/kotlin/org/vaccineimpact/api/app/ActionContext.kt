package org.vaccineimpact.api.app

import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import spark.Request
import java.io.OutputStream
import kotlin.reflect.KClass

interface ActionContext
{
    val request: Request
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
    fun <T: Any> csvData(klass: KClass<T>): List<T>

    fun addResponseHeader(key: String, value: String): Unit
    fun addAttachmentHeader(filename: String): Unit
    fun setResponseStatus(status: Int): Unit
    fun streamedResponse(work: (OutputStream) -> Unit): StreamedResponse

    fun hasPermission(requirement: ReifiedPermission): Boolean
    fun requirePermission(requirement: ReifiedPermission): Unit
}

inline fun <reified T: Any> ActionContext.postData() = this.postData(T::class.java)
inline fun <reified T: Any> ActionContext.csvData() = this.csvData(T::class)

class StreamedResponse