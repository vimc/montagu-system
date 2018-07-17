package org.vaccineimpact.api.models

data class Expectations(
        val years: IntRange,
        val ages: IntRange,
        val cohorts: CohortRestriction,
        val countries: List<Country>,
        val outcomes: List<String>
)

data class CohortRestriction(
        val minimumBirthYear: Short? = null,
        val maximumBirthYear: Short? = null
)

fun Expectations.toSequence(): Sequence<BurdenEstimate>
{
    val numYears = this.years.count()
    val numAges = this.ages.count()
    val numCountries = this.countries.count()

    var numRows = numYears * numAges * numCountries

    val outcomes = this.outcomes.associateBy({ it }, { 0F })

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
