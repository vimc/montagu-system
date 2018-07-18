package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.TouchstoneStatus

data class ResponsibilitiesAndTouchstoneStatus(
        val responsibilities: Responsibilities,
        val touchstoneStatus: TouchstoneStatus
)
