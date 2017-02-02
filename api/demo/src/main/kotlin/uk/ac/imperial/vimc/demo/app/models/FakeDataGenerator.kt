package uk.ac.imperial.vimc.demo.app.models

import uk.ac.imperial.vimc.demo.app.extensions.toSeed
import java.util.*

class FakeDataGenerator {
    fun generateOutcomes(scenario: Scenario): List<CountryOutcomes> {
        val random = Random(scenario.id.toSeed())
        return scenario.countries.map { CountryOutcomes(it, generateOutcomesList(random, scenario.years)) }
    }

    private fun generateOutcomesList(random: Random, years: IntRange): List<Outcome> {
        return years.map { Outcome(it, random.nextInt(100000) + 10000) }
    }
}
