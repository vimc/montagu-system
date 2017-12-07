package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.FlexibleColumns
import java.math.BigDecimal

@FlexibleColumns
data class BurdenEstimate(
        val disease: String,
        val year: Int,
        val age: Int,
        val country: String,
        val countryName: String,
        val cohortSize: BigDecimal,
        val outcomes: Map<String, BigDecimal?>
)

@FlexibleColumns
data class StochasticBurdenEstimate(
        val disease: String,
        val runId: String,
        val year: Int,
        val age: Int,
        val country: String,
        val countryName: String,
        val cohortSize: BigDecimal,
        val outcomes: Map<String, BigDecimal?>
)

data class BurdenEstimateWithRunId(
        val disease: String,
        val runId: String?,
        val year: Int,
        val age: Int,
        val country: String,
        val countryName: String,
        val cohortSize: BigDecimal,
        val outcomes: Map<String, BigDecimal?>
)
{
    constructor(estimate: BurdenEstimate, runId: String?) : this(
            estimate.disease, runId,
            estimate.year, estimate.age, estimate.country, estimate.countryName,
            estimate.cohortSize, estimate.outcomes
    )
    constructor(estimate: StochasticBurdenEstimate) : this(
            estimate.disease, estimate.runId,
            estimate.year, estimate.age, estimate.country, estimate.countryName,
            estimate.cohortSize, estimate.outcomes
    )
}