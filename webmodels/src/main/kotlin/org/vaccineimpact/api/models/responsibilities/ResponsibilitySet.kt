package org.vaccineimpact.api.models.responsibilities

data class ResponsibilitySet(
        val touchstoneVersion: String,
        val modellingGroupId: String,
        val status: ResponsibilitySetStatus?,
        val responsibilities: List<Responsibility>
        //val problems: String = null # Not implemented yet
) : Iterable<Responsibility>
{
    override fun iterator() = responsibilities.iterator()
}