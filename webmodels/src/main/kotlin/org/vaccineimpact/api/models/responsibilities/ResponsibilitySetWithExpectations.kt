package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.ExpectationMapping

data class ResponsibilitySetWithExpectations(
        val modellingGroupId: String,
        val touchstoneVersion: String,
        val status: ResponsibilitySetStatus,
        val responsibilities: List<Responsibility>,
        val expectations: List<ExpectationMapping>
)
{
    constructor(set: ResponsibilitySet, touchstoneVersion: String, expectations: List<ExpectationMapping>) : this(
            set.modellingGroupId,
            touchstoneVersion,
            set.status,
            set.responsibilities,
            expectations
    )
}
