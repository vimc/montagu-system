package org.vaccineimpact.api.models

class Expectations(
        val years: IntRange,
        val ages: IntRange,
        val cohorts: CohortRestriction,
        val countries: List<Country>,
        val outcomes: List<String>)
{
    private fun Int.withinCohortRange(): Boolean
    {
        return (cohorts.minimumBirthYear == null || this >= cohorts.minimumBirthYear)
                && (cohorts.maximumBirthYear == null || this <= cohorts.maximumBirthYear)
    }

    private fun numRows(): Int
    {
        var numCohorts = 0

        for (age in ages)
        {
            years
                    .map { it - age }
                    .filter { it.withinCohortRange() }
                    .forEach { numCohorts++ }
        }

        val numCountries = countries.count()
        return numCohorts * numCountries
    }

    private val outcomesMap = outcomes.associateBy({ it }, { 0F })

    fun toSequence(): Sequence<BurdenEstimate>
    {
        var numRows = numRows()

        return generateSequence {
            (numRows--)
            if (numRows < 0)
            {
                null // terminate sequence
            }
            else
            {
                BurdenEstimate("", 0, 0, "", "", 0F, outcomesMap)
            }
        }
    }

    fun toStochasticSequence(): Sequence<StochasticBurdenEstimate>
    {
        var numRows = numRows()
        val numRuns = 200
        numRows *= numRuns

        return generateSequence {
            (numRows--)
            if (numRows < 0)
            {
                null // terminate sequence
            }
            else
            {
                StochasticBurdenEstimate("", "", 0, 0, "", "", 0F, outcomesMap)
            }
        }
    }

}

data class CohortRestriction(
        val minimumBirthYear: Short? = null,
        val maximumBirthYear: Short? = null
)