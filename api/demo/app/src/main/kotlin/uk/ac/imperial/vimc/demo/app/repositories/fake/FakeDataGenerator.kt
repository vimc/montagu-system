package uk.ac.imperial.vimc.demo.app.repositories.fake

import uk.ac.imperial.vimc.demo.app.extensions.clamp
import uk.ac.imperial.vimc.demo.app.extensions.toSeed
import uk.ac.imperial.vimc.demo.app.models.*
import uk.ac.imperial.vimc.demo.app.repositories.ScenarioRepository
import java.math.BigDecimal
import java.time.Duration
import java.util.*
import java.util.concurrent.TimeUnit

class FakeDataGenerator
{
    fun generateCoverage(scenarioId: String, countries: Iterable<Country>, years: IntRange): List<CountryCoverage>
    {
        val random = Random(scenarioId.toSeed())
        return countries.map { CountryCoverage(it.id, generateCountryCoverage(random, years)) }
    }

    private fun generateCountryCoverage(random: Random, years: IntRange): List<YearCoverage>
    {
        var coverage = random.nextInt(100)
        return years.map {
            coverage = mutate(coverage, random)
            YearCoverage(it, BigDecimal(coverage))
        }
    }

    private fun mutate(coverage: Int, random: Random) = (coverage - 8 + random.nextInt(16)).clamp(0, 100)

    fun generateOutcomes(scenarioId: String, scenarioRepository: ScenarioRepository): List<CountryOutcomes>
    {
        val scenario = scenarioRepository.getScenarioAndCoverage(scenarioId)
        val random = Random(scenario.scenario.id.toSeed())
        return scenarioRepository.getScenarioCountries(scenarioId).map { CountryOutcomes(it.id, generateOutcomesList(random, scenario.years)) }
    }

    private fun generateOutcomesList(random: Random, years: IntRange): List<Outcome>
    {
        return years.map { Outcome(it, random.nextInt(100000) + 10000) }
    }

    private val timeRandomizer = Random(354373)
    private val oneDayInMillis = TimeUnit.DAYS.toMillis(1).toInt()

    fun randomTimeOffset(): Duration
    {
        return Duration.ofMillis(timeRandomizer.nextInt(oneDayInMillis).toLong())
    }
}
