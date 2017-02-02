package uk.ac.imperial.vimc.demo.app.models

import uk.ac.imperial.vimc.demo.app.extensions.toSeed
import java.time.LocalDate
import java.util.*

@Suppress("unused")
class ImpactEstimate(val id: Int,
                     val scenario: Scenario,
                     val modelVersion : String,
                     val dateUploaded: LocalDate,
                     countries: Set<Country>,
                     val years: IntRange) {
    val outcomes = generateFakeOutcomes(countries)

    private fun generateFakeOutcomes(countries: Set<Country>): List<CountryOutcomes> {
        val random = Random(scenario.id.toSeed())
        return countries.map { CountryOutcomes(it, random, years) }
    }
}