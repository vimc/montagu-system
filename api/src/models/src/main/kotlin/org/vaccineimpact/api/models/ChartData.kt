package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class BurdenEstimateDataSeries(val burdenEstimateGrouping: BurdenEstimateGrouping,
                                    val data: Map<Short, List<BurdenEstimateDataPoint>>)

data class BurdenEstimateDataPoint
@ConstructorProperties("year", "age", "value", "groupBy")
constructor(
        val year: Short,
        val age: Short,
        val value: Float
)

enum class BurdenEstimateGrouping
{
    AGE, YEAR
}