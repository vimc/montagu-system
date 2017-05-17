package org.vaccineimpact.api.app.security

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.models.ReifiedPermission
import org.vaccineimpact.api.models.Scope

data class PermissionRequirement(val name: String, val scopeRequirement: ScopeRequirement)
{
    fun reify(context: ActionContext) = ReifiedPermission(name, scopeRequirement.reify(context))

    override fun toString() = "$scopeRequirement/$name"

    companion object
    {
        fun parse(raw: String): PermissionRequirement
        {
            val parts = raw.split('/')
            val rawScope = parts[0]
            val name = parts[1]
            return PermissionRequirement(name, ScopeRequirement.parse(rawScope))
        }
    }
}

sealed class ScopeRequirement(val value: String)
{
    class Global: ScopeRequirement("*")
    class Specific(val prefix: String, val scopeIdUrlKey: String): ScopeRequirement("$prefix:<$scopeIdUrlKey>")

    fun reify(context: ActionContext) = when (this)
    {
        is Global -> Scope.Global()
        is Specific -> Scope.Specific(prefix, context.params(scopeIdUrlKey))
    }

    override fun toString() = value

    companion object
    {
        fun parse(rawScope: String): ScopeRequirement
        {
            if (rawScope == "*")
            {
                return Global()
            }
            else
            {
                val parts = rawScope.split(':')
                val idKey = parts[1]
                if (!idKey.startsWith('<') || !idKey.endsWith('>'))
                {
                    throw Exception("Unable to parse $rawScope as a scope requirement - missing angle brackets from scope ID URL key")
                }
                return Specific(parts[0], idKey.trim('<', '>'))
            }
        }
    }
}