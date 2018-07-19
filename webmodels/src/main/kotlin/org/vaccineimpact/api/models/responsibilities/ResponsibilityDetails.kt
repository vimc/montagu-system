package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.Expectations
import org.vaccineimpact.api.models.TouchstoneVersion

data class ResponsibilityDetails(
        val responsibility: Responsibility,
        val touchstoneVersion: TouchstoneVersion,
        val expectations: Expectations
)
