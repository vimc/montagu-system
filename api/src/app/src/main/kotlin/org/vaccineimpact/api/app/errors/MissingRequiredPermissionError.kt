package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.permissions.ReifiedPermission

class MissingRequiredPermissionError(missingPermissions: Set<ReifiedPermission>) : MontaguError(403, listOf(
        ErrorInfo("forbidden", "You do not have sufficient permissions to access this resource. " +
                "Missing these permissions: ${missingPermissions.joinToString(", ")}")
))