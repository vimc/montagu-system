package org.vaccineimpact.api.app.security

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.Touchstone
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.TouchstoneVersion
import org.vaccineimpact.api.models.permissions.ReifiedPermission

fun ActionContext.checkIsAllowedToSeeTouchstone(touchstoneVersionId: String, touchstoneStatus: TouchstoneStatus)
{
    val permission = ReifiedPermission("touchstones.prepare", Scope.Global())
    if (touchstoneStatus == TouchstoneStatus.IN_PREPARATION && !this.hasPermission(permission))
    {
        throw UnknownObjectError(touchstoneVersionId, TouchstoneVersion::class)
    }
}

fun ActionContext.isAllowedToSeeTouchstoneVersion(touchstoneVersion: TouchstoneVersion): Boolean
{
    val permission = ReifiedPermission("touchstones.prepare", Scope.Global())
    return this.hasPermission(permission)
            || touchstoneVersion.status != TouchstoneStatus.IN_PREPARATION
}

fun List<Touchstone>.filterByPermission(context: ActionContext) = this
        .map { it.copy(versions = it.versions.filterByPermission(context)) }
        .filter { it.versions.any() }
        .toList()

@JvmName("filterTouchstoneVersionByPermission")
private fun List<TouchstoneVersion>.filterByPermission(context: ActionContext) =
        this.filter { context.isAllowedToSeeTouchstoneVersion(it) }

fun ActionContext.getAllowableTouchstoneStatusList(): List<TouchstoneStatus>
{
    val result =  mutableListOf<TouchstoneStatus>(TouchstoneStatus.FINISHED, TouchstoneStatus.OPEN)
    if (this.hasPermission(ReifiedPermission("touchstones.prepare", Scope.Global())))
    {
        result.add(TouchstoneStatus.IN_PREPARATION)
    }
    return result
}

fun ActionContext.checkEstimatePermissionsForTouchstoneVersion(
        groupId: String,
        touchstoneVersionId: String,
        estimateRepository: BurdenEstimateRepository,
        readEstimatesRequired: Boolean = false
)
{
    val versions = estimateRepository.touchstoneRepository.touchstoneVersions
    val touchstoneVersion = versions.get(touchstoneVersionId)
    this.checkIsAllowedToSeeTouchstone(touchstoneVersionId, touchstoneVersion.status)
    if (readEstimatesRequired)
    {
        if (touchstoneVersion.status == TouchstoneStatus.OPEN)
        {
            this.requirePermission(ReifiedPermission(
                    "estimates.read-unfinished",
                    Scope.Specific("modelling-group", groupId)
            ))
        }
    }
}