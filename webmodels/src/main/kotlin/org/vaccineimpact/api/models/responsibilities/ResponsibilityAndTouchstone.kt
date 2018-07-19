package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.TouchstoneVersion

data class ResponsibilityAndTouchstone(
        val touchstoneVersion: TouchstoneVersion,
        val responsibility: Responsibility
)
