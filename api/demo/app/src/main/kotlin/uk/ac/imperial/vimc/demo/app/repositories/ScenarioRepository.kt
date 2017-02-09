package uk.ac.imperial.vimc.demo.app.repositories

import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.Country
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.models.ScenarioAndCoverage

interface ScenarioRepository {
    val countries: DataSet<Country, String>
    val scenarios: DataSet<Scenario, String>

    fun getScenarios(scenarioFilterParameters: ScenarioFilterParameters): Iterable<Scenario>
    fun getScenarioAndCoverage(scenarioId: String): ScenarioAndCoverage
    fun getScenarioCountries(scenarioId: String): List<Country>
}