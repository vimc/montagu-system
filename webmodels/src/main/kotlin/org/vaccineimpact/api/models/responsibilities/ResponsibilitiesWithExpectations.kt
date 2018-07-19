package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.ExpectationMapping

data class ResponsibilitiesWithExpectations(
        val touchstoneVersion: String,
        val problems: String,
        val status: ResponsibilitySetStatus?,
        val responsibilities: List<Responsibility>,
        val expectations: List<ExpectationMapping>
)
{
    constructor(responsibilities: Responsibilities, expectations: List<ExpectationMapping>): this(
            responsibilities.touchstoneVersion,
            responsibilities.problems,
            responsibilities.status,
            responsibilities.responsibilities,
            expectations
    )

}