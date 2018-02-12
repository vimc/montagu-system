package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class WrongDataFormatError(format: String, expectedFormat: String)
    : MontaguError(415, listOf(ErrorInfo(
        "wrong-data-format",
        "The submitted data was identified as having this format: $format. " +
                "However, '$expectedFormat' was expected."
)))