package org.vaccineimpact.api.app.models

data class Responsibilities(
        val group: ModellingGroup,
        val responsibilities: List<Scenario>,
        val responsibilitySetStatus: ResponsibilitySetStatus?) : Iterable<Scenario>
{
    override fun iterator() = responsibilities.iterator()
}

enum class ResponsibilitySetStatus
{
    INCOMPLETE,
    SUBMITTED,
    APPROVED
}