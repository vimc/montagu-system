package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.TouchstoneVersion

data class ResponsibilityAndTouchstone(
        val responsibilityId: Int,
        val responsibility: Responsibility,
        val touchstoneVersion: TouchstoneVersion
)
