package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.TouchstoneStatus

data class ResponsibilitySetAndTouchstoneStatus(
        val responsibilitySet: ResponsibilitySet,
        val touchstoneStatus: TouchstoneStatus
)
