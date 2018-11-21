package org.vaccineimpact.api.tests.serialization

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.models.BurdenEstimateDataPoint
import org.vaccineimpact.api.models.BurdenEstimateDataSeries
import org.vaccineimpact.api.models.BurdenEstimateGrouping
import org.vaccineimpact.api.serialization.MontaguSerializer

class BurdenEstimateDataSeriesTypeAdaptor
{
    private val serializer = MontaguSerializer.instance

    @Test
    fun `can write burden estimate data series with age on x axis`()
    {
        val data: Map<Short, List<BurdenEstimateDataPoint>> =
                mapOf(1.toShort() to listOf(BurdenEstimateDataPoint(2000, 1, 100F),
                        BurdenEstimateDataPoint(2001, 1, 101F),
                        BurdenEstimateDataPoint(2002, 1, 102F)),
                        2.toShort() to listOf(BurdenEstimateDataPoint(2000, 2, 200F),
                                BurdenEstimateDataPoint(2001, 2, 201F),
                                BurdenEstimateDataPoint(2002, 2, 202F)))

        val series = BurdenEstimateDataSeries(BurdenEstimateGrouping.AGE, data)

        val result = serializer.gson.toJson(series)
        val expected = """
{
  "1": [
    {
      "x": 2000,
      "y": 100.0
    },
    {
      "x": 2001,
      "y": 101.0
    },
    {
      "x": 2002,
      "y": 102.0
    }
  ],
  "2": [
    {
      "x": 2000,
      "y": 200.0
    },
    {
      "x": 2001,
      "y": 201.0
    },
    {
      "x": 2002,
      "y": 202.0
    }
  ]
}
        """.trimIndent()
        assertThat(result).isEqualTo(expected)
    }

    @Test
    fun `can write burden estimate data series with year on x axis`()
    {
        val data: Map<Short, List<BurdenEstimateDataPoint>> =
                mapOf(2000.toShort() to listOf(BurdenEstimateDataPoint(2000, 0, 100F),
                        BurdenEstimateDataPoint(2000, 1, 101F),
                        BurdenEstimateDataPoint(2000, 2, 102F)),
                        2001.toShort() to listOf(BurdenEstimateDataPoint(2001, 0, 200F),
                                BurdenEstimateDataPoint(2001, 1, 201F),
                                BurdenEstimateDataPoint(2001, 2, 202F)))

        val series = BurdenEstimateDataSeries(BurdenEstimateGrouping.YEAR, data)

        val result = serializer.gson.toJson(series)
        val expected = """
{
  "2000": [
    {
      "x": 0,
      "y": 100.0
    },
    {
      "x": 1,
      "y": 101.0
    },
    {
      "x": 2,
      "y": 102.0
    }
  ],
  "2001": [
    {
      "x": 0,
      "y": 200.0
    },
    {
      "x": 1,
      "y": 201.0
    },
    {
      "x": 2,
      "y": 202.0
    }
  ]
}
        """.trimIndent()
        assertThat(result).isEqualTo(expected)
    }

}