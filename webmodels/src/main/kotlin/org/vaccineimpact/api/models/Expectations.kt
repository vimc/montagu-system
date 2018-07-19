package org.vaccineimpact.api.models

class Expectations(
        val id: Int,
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

    fun expectedRows(): List<ExpectedRow>
    {
        val listRows = mutableListOf<ExpectedRow>()
        for (age in ages)
        {
            for (country in countries)
            {
                listRows.addAll(years
                        .map { it - age }
                        .filter { it.withinCohortRange() }
                        .map { ExpectedRow(country.id, age, it) })
            }
        }

        return listRows
    }

}

data class CohortRestriction(
        val minimumBirthYear: Short? = null,
        val maximumBirthYear: Short? = null
)

data class ExpectedRow(
        val country: String,
        val age: Int,
        val year: Int
)