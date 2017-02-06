package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.Scenario

@Suppress("Unused")
class ViewScenario(scenario: Scenario) {
    val scenario = ViewScenarioMetadata(scenario)
    val countries = scenario.countries.map { it.id }
    val years = scenario.years
    val coverage = scenario.coverage
}