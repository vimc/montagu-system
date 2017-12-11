package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class UnknownRunIdError(runId: String, runParameterSetId: Int?) : MontaguError(400, listOf(
        ErrorInfo(
                "unknown-run-id", "Unknown run ID with id '$runId'. " +
                "Attempting to match against run parameter set $runParameterSetId"
        )
))