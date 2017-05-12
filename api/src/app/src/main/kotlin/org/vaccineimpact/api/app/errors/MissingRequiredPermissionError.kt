package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class MissingRequiredPermissionError(missingPermissions: Set<String>) : MontaguError(403, listOf(
        ErrorInfo("forbidden", "You do not have sufficient permissions to access this resource. " +
                "Missing these permissions: ${missingPermissions.joinToString(", ")}")
))