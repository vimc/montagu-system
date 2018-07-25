package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.FlexibleProperty
import kotlin.coroutines.experimental.buildSequence

data class Expectations(
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

    private val outcomesMap = outcomes.associateBy({ it }, { null })

    fun expectedCentralRows(disease: String): Sequence<ExpectedCentralRow> = buildSequence{
        for (age in ages)
        {
            for (country in countries)
            {
                yieldAll(years
                        .filter { (it - age).withinCohortRange() }
                        .map { mapCentralRow(disease, it, age, country) })
            }
        }
    }

    fun expectedStochasticRows(disease: String): Sequence<ExpectedStochasticRow> = buildSequence {
        for (age in ages)
        {
            for (country in countries)
            {
                yieldAll(years
                        .filter { (it - age).withinCohortRange() }
                        .map { mapStochasticRow(disease, it, age, country) })
            }
        }
    }

    private fun mapCentralRow(disease: String, year: Int, age: Int, country: Country): ExpectedCentralRow
    {
        return ExpectedCentralRow(disease, year, age, country.id, country.name, null, outcomesMap)
    }

    private fun mapStochasticRow(disease: String, year: Int, age: Int, country: Country): ExpectedStochasticRow
    {
        return ExpectedStochasticRow(disease, null, year, age, country.id, country.name, null, outcomesMap)
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