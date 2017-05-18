package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.exceptions.ReifiedPermissionParseException

// A permission is just a name, like 'coverage.read'
// To be usable, it must be reified with a scope, like:
// */coverage.read (for the global scope)
// modelling-group:IC-Garske/coverage.read (for a more specific scope)
data class ReifiedPermission(
        val name: String,
        val scope: Scope
)
{
    override fun toString() = "$scope/$name"

    fun satisfiedBy(permission: ReifiedPermission)
            = name == permission.name && permission.scope.encompasses(scope)

    companion object
    {
        fun parse(raw: String): ReifiedPermission
        {
            try
            {
                val parts = raw.split('/')
                val rawScope = parts[0]
                val name = parts[1]
                return ReifiedPermission(name, Scope.parse(rawScope))
            } catch (e: Exception)
            {
                throw ReifiedPermissionParseException(raw)
            }
        }
    }
}

class PermissionSet(val permissions: Set<ReifiedPermission>): Set<ReifiedPermission> by permissions
{
    constructor(vararg rawPermissions: String)
        : this(rawPermissions.map { ReifiedPermission.parse(it) }.toSet())
    constructor(rawPermissions: Iterable<String>)
            : this(rawPermissions.map { ReifiedPermission.parse(it) }.toSet())

    val names by lazy { permissions.map { it.name }.distinct() }

    infix operator fun plus(other: PermissionSet) = PermissionSet(this.permissions + other.permissions)
    infix operator fun plus(other: ReifiedPermission) = PermissionSet(this.permissions + other)
    infix operator fun plus(other: String) = this + ReifiedPermission.parse(other)

    override fun toString(): String
    {
        return "[${permissions.joinToString()}]"
    }
}