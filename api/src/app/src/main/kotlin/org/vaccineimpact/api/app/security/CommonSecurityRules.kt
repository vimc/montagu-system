package org.vaccineimpact.api.app.security

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.errors.UnknownObjectError
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