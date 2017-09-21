package org.vaccineimpact.api.models.permissions

import org.vaccineimpact.api.models.Scope
import java.beans.ConstructorProperties

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


data class RoleAssignment @ConstructorProperties("name", "scopePrefix", "scopeId")
constructor(
        val name: String,
        var scopePrefix: String?,
        var scopeId: String?
)

data class AssociateRole(val action: String,
                     val name: String,
                     val scopePrefix: String?,
                     val scopeId: String?)