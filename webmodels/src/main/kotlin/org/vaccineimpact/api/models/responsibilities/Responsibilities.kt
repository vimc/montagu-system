package org.vaccineimpact.api.models.responsibilities

data class Responsibilities(
        val touchstoneVersion: String,
        val problems: String,
        val status: ResponsibilitySetStatus?,
        val responsibilities: List<Responsibility>) : Iterable<Responsibility>
{
    override fun iterator() = responsibilities.iterator()
}
