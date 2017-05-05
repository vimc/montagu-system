package org.vaccineimpact.api.models

data class Role(
        val id: Int,
        val name: String,
        val scopePrefix: String?,
        val description: String
)