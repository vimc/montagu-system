package org.vaccineimpact.api.app.security

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.permissions.ReifiedPermission

fun ActionContext.checkIsAllowedToSeeTouchstone(touchstoneId: String, touchstoneStatus: TouchstoneStatus)
{
    val permission = ReifiedPermission("touchstones.prepare", Scope.Global())
    if (touchstoneStatus == TouchstoneStatus.IN_PREPARATION && !this.hasPermission(permission))
    {
        throw UnknownObjectError(touchstoneId, "Touchstone")
    }
}

fun ActionContext.isAllowedToSeeTouchstone(touchstoneStatus: TouchstoneStatus): Boolean
{
    val permission = ReifiedPermission("touchstones.prepare", Scope.Global())
    if (!this.hasPermission(permission) && touchstoneStatus == TouchstoneStatus.IN_PREPARATION)
    {
        return false
    }
    return true
}

fun ActionContext.checkEstimatePermissionsForTouchstone(
        groupId: String,
        touchstoneId: String,
        estimateRepository: BurdenEstimateRepository,
        readEstimatesRequired: Boolean = false
)
{

    val touchstones = estimateRepository.touchstoneRepository.touchstones
    val touchstone = touchstones.get(touchstoneId)
    this.checkIsAllowedToSeeTouchstone(touchstoneId, touchstone.status)
    if (readEstimatesRequired)
    {
        if (touchstone.status == TouchstoneStatus.OPEN)
        {
            this.requirePermission(ReifiedPermission(
                    "estimates.read-unfinished",
                    Scope.Specific("modelling-group", groupId)
            ))
        }
    }
}