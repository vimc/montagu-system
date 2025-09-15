package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.expectations.ExpectationMapping

data class ResponsibilitySetWithExpectations(
        val modellingGroupId: String,
        val touchstoneVersion: String,
        val status: ResponsibilitySetStatus?,
        val responsibilities: List<Responsibility>,
        val expectations: List<ExpectationMapping>
)
{
    constructor(set: ResponsibilitySet, expectations: List<ExpectationMapping>) : this(
            set.modellingGroupId,
            set.touchstoneVersion,
            set.status,
            set.responsibilities,
            expectations
    )
}
