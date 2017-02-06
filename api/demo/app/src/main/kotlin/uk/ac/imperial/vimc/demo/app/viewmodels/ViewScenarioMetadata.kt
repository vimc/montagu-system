package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.Scenario

@Suppress("Unused")
class ViewScenarioMetadata(scenario: Scenario) {
    val id = scenario.id
    val description = scenario.description
    val vaccinationLevel = scenario.vaccinationLevel
    val vaccine = scenario.vaccine
    val disease = scenario.disease
    val scenarioType = scenario.scenarioType
}