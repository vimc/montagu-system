package uk.ac.imperial.vimc.demo.app.models

import uk.ac.imperial.vimc.demo.app.extensions.clamp
import java.math.BigDecimal
import java.util.*

class CountryCoverage(country: Country, random: Random, years: IntRange) {
    @Suppress("unused")
    val country = country.toString()
    @Suppress("unused")
    val data = generateFakeData(random, years)

    private fun generateFakeData(random: Random, years: IntRange): List<YearCoverage> {
        var coverage = random.nextInt(100)
        return years.map {
            coverage = mutate(coverage, random)
            YearCoverage(it, BigDecimal(coverage))
        }
    }

    private fun mutate(coverage: Int, random: Random) = (coverage - 8 + random.nextInt(16)).clamp(0, 100)
}

data class YearCoverage(val year: Year, val coverage: BigDecimal)