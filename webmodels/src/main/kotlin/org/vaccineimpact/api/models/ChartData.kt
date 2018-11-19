package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class DataPoint
constructor(
        val x: Short,
        val y: Float
)

interface ChartSerializable
{
    fun toDataPoint(): DataPoint
}

data class DisAggregatedBurdenEstimate
@ConstructorProperties("year", "age", "value", "groupBy")
constructor(
        val year: Short,
        val age: Short,
        val value: Float,
        val groupBy: BurdenEstimateGrouping
) : ChartSerializable
{
    override fun toDataPoint(): DataPoint = if (groupBy == BurdenEstimateGrouping.AGE)
    {
        DataPoint(this.year, this.value)
    }
    else
    {
        DataPoint(this.age, this.value)
    }
}

enum class BurdenEstimateGrouping
{
    AGE, YEAR
}