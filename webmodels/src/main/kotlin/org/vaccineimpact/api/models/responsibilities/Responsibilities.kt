package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.ExpectationMapping

data class Responsibilities(
        val touchstoneVersion: String,
        val problems: String,
        val status: ResponsibilitySetStatus?,
        val responsibilities: List<Responsibility>
) : Iterable<Responsibility>
{
    override fun iterator() = responsibilities.iterator()
}
