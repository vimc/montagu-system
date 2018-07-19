package org.vaccineimpact.api.models.responsibilities

data class ResponsibilitySet(
        val modellingGroupId: String,
        val status: ResponsibilitySetStatus,
        val responsibilities: List<Responsibility>
)
