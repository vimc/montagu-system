package uk.ac.imperial.vimc.demo.app.filters

import uk.ac.imperial.vimc.demo.app.models.Scenario

object ScenarioFilter : ParameterFilterSet<Scenario>() {
    init {
        add("scenario_id", { it.id })
        add("disease", { it.disease })
        add("vaccine", { it.vaccine })
        add("vaccination_level", { it.vaccinationLevel })
        add("scenario_type", { it.scenarioType })
        add("scenario_description", { it.description })
    }
}