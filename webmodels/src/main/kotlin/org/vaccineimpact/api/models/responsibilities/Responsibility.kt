package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.Scenario

data class Responsibility(
        val scenario: Scenario,
        val status: ResponsibilityStatus,
        val problems: List<String>,
        val currentEstimateSet: BurdenEstimateSet?
)

data class ResponsibilityWithDatabaseId(
        val id: Int,
        val responsibility: Responsibility
)

data class ResponsibilityWithComment(
        val scenarioId: String,
        val comment: ResponsibilityComment?
)
