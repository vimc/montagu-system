package uk.ac.imperial.vimc.demo.app.models

import uk.ac.imperial.vimc.demo.app.extensions.toSeed
import java.util.*

class ScenarioWithData(val scenario: Scenario, countries: Set<Country>, @Suppress("CanBeParameter") val years: IntRange) {
    @Suppress("unused")
    val coverage = generateFakeData(scenario.id, countries, years)
    @Suppress("unused")
    val countries = countries.map { it.toString() }

    private fun generateFakeData(scenarioId: String, countries: Set<Country>, years: IntRange)
            : List<CountryCoverage> {
        val random = Random(scenarioId.toSeed())
        return countries.map { CountryCoverage(it, random, years) }
    }
}