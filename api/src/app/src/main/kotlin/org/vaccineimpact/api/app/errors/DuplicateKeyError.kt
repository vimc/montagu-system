package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class DuplicateKeyError(fields: Map<String, String>) : MontaguError(409, fields.map {
    ErrorInfo(
        "duplicate-key:${it.key}",
        "An object already exists with the value '${it.value}' for '${it.key}'"
    )
})