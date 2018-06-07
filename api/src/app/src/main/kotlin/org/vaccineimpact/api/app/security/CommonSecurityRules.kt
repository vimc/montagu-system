package org.vaccineimpact.api.app.security

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.Touchstone
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.TouchstoneVersion
import org.vaccineimpact.api.models.permissions.ReifiedPermission

fun ActionContext.checkIsAllowedToSeeTouchstone(touchstoneId: String, touchstoneStatus: TouchstoneStatus)
{
    val permission = ReifiedPermission("touchstones.prepare", Scope.Global())
    if (touchstoneStatus == TouchstoneStatus.IN_PREPARATION && !this.hasPermission(permission))
    {
        throw UnknownObjectError(touchstoneId, "TouchstoneVersion")
    }
}

fun ActionContext.isAllowedToSeeTouchstoneVersion(touchstoneVersion: TouchstoneVersion): Boolean
{
    val permission = ReifiedPermission("touchstones.prepare", Scope.Global())
    return this.hasPermission(permission)
            || touchstoneVersion.status != TouchstoneStatus.IN_PREPARATION
}

fun ActionContext.checkEstimatePermissionsForTouchstoneVersion(
        groupId: String,
        touchstoneVersionId: String,
        estimateRepository: BurdenEstimateRepository,
        readEstimatesRequired: Boolean = false
)
{
    val touchstones = estimateRepository.touchstoneRepository.touchstoneVersions
    val touchstone = touchstones.get(touchstoneVersionId)
    this.checkIsAllowedToSeeTouchstone(touchstoneVersionId, touchstone.status)
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