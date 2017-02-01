package uk.ac.imperial.vimc.demo.app.models

import java.util.*

class CountryOutcomes(@Suppress("unused") val country: Country, random: Random, years: IntRange) {
    val data = generateFakeOutcomes(random, years)

    private fun generateFakeOutcomes(random: Random, years: IntRange): List<Outcome> {
        return years.map { Outcome(it, random.nextInt(100000) + 10000) }
    }
}

data class Outcome(val year: Year, val numberOfDeaths: Int)