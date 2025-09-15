package org.vaccineimpact.api.app.models

import org.vaccineimpact.api.models.validation.MinimumLength

data class SetPassword(
        @MinimumLength(8)
        val password: String
)