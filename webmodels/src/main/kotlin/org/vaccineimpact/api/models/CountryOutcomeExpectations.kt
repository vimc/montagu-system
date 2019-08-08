package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.FlexibleProperty
import kotlin.coroutines.experimental.buildSequence

data class CountryOutcomeExpectations(
        override val id: Int,
        override val description: String,
        override val years: IntRange,
        override val ages: IntRange,
        override val cohorts: CohortRestriction,
        val countries: List<Country>,
        override val outcomes: List<String>): Expectations
{
    private fun Int.withinCohortRange(): Boolean
    {
        return (cohorts.minimumBirthYear == null || this >= cohorts.minimumBirthYear)
                && (cohorts.maximumBirthYear == null || this <= cohorts.maximumBirthYear)
    }

    data class RowDeterminer(val year: Int, val age: Int, val country: Country)

    fun expectedCentralRows(disease: String) = expectedRows()
            .map { mapCentralRow(disease, it.year, it.age, it.country) }

    fun expectedStochasticRows(disease: String) = expectedRows()
            .map { mapStochasticRow(disease, it.year, it.age, it.country) }

    private fun expectedRows(): Sequence<RowDeterminer> = buildSequence {
        for (age in ages)
        {
            for (country in countries)
            {
                yieldAll(years
                        .filter { (it - age).withinCohortRange() }
                        .map { RowDeterminer(it, age, country) })

            }
        }
    }

    fun expectedRowLookup(): RowLookup
    {
        val map = RowLookup()
        for (country in countries)
        {
            val ageMap = AgeLookup()
            for (age in ages)
            {
                val yearMap = YearLookup()
                years.map { if ((it - age).withinCohortRange()) yearMap[it.toShort()] = false }
                ageMap[age.toShort()] = yearMap
            }
            map[country.id] = ageMap
        }
        return map
    }

    private fun outcomesMap() = outcomes.associateBy({ it }, { null })

    private fun mapCentralRow(disease: String, year: Int, age: Int, country: Country): ExpectedCentralRow
    {
        return ExpectedCentralRow(disease, year, age, country.id, country.name, null, outcomesMap())
    }

    private fun mapStochasticRow(disease: String, year: Int, age: Int, country: Country): ExpectedStochasticRow
    {
        return ExpectedStochasticRow(disease, null, year, age, country.id, country.name, null, outcomesMap())
    }

}

data class CohortRestriction(
        val minimumBirthYear: Short? = null,
        val maximumBirthYear: Short? = null
)

data class ExpectedCentralRow(
        val disease: String,
        val year: Int,
        val age: Int,
        val country: String,
        val countryName: String,
        val cohortSize: Float?,
        @FlexibleProperty
        val outcomes: Map<String, Float?>
) : ExpectedRow

data class ExpectedStochasticRow(
        val disease: String,
        val runId: Int?,
        val year: Int,
        val age: Int,
        val country: String,
        val countryName: String,
        val cohortSize: Float?,
        @FlexibleProperty
        val outcomes: Map<String, Float?>
) : ExpectedRow

interface ExpectedRow
