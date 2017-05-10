package org.vaccineimpact.api.models

data class Role(
        val id: Int,
        val name: String,
        val scopePrefix: String?,
        val description: String
)

data class ReifiedRole(
        val name: String,
        val scope: Scope
)
{
    override fun toString() = "$scope/$name"
}