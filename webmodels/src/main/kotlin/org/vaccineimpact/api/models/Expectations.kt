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

    fun toSequence(): Sequence<BurdenEstimate>
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
        var numRows = numCohorts * numCountries
        val outcomes = outcomes.associateBy({ it }, { 0F })

        return generateSequence {
            (numRows--)
            if (numRows < 0)
            {
                null // terminate sequence
            }
            else
            {
                BurdenEstimate("", 0, 0, "", "", 0F, outcomes)
            }
        }
    }

}

data class CohortRestriction(
        val minimumBirthYear: Short? = null,
        val maximumBirthYear: Short? = null
)