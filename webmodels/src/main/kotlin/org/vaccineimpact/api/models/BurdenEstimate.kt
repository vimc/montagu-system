package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.FlexibleColumns
import org.vaccineimpact.api.models.helpers.FlexibleProperty
import java.beans.ConstructorProperties

data class DataPoint
constructor(
        val x: Short,
        val y: Float
)

interface ChartSerializable {
    fun toDataPoint(): DataPoint
}

data class DisAggregatedBurdenEstimate
@ConstructorProperties("year", "age", "value")
constructor(
        val year: Short,
        val age: Short,
        val value: Float
): ChartSerializable
{

    override fun toDataPoint(): DataPoint = DataPoint(this.year, this.value)
}

interface BurdenEstimateRow

@FlexibleColumns
data class BurdenEstimate(
        val disease: String,
        val year: Short,
        val age: Short,
        val country: String,
        val countryName: String,
        val cohortSize: Float,
        @FlexibleProperty
        val outcomes: Map<String, Float?>
) : BurdenEstimateRow

@FlexibleColumns
data class StochasticBurdenEstimate(
        val disease: String,
        val runId: String,
        val year: Short,
        val age: Short,
        val country: String,
        val countryName: String,
        val cohortSize: Float,
        @FlexibleProperty
        val outcomes: Map<String, Float?>
) : BurdenEstimateRow

data class BurdenEstimateWithRunId(
        val disease: String,
        val runId: String?,
        val year: Short,
        val age: Short,
        val country: String,
        val countryName: String,
        val cohortSize: Float,
        @FlexibleProperty
        val outcomes: Map<String, Float?>
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