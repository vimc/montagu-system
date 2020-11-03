package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class ForeignKeyError(field: String, row: String) : MontaguError(400, listOf(
        ErrorInfo(
                "foreign-key-error",
                "Unrecognised $field: $row"
        )
))
