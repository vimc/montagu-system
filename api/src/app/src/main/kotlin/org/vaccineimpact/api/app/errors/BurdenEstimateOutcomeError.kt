package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class BurdenEstimateOutcomeError(message: String) : MontaguError(400, listOf(
        ErrorInfo("burden-estimate-outcome", message)
))
