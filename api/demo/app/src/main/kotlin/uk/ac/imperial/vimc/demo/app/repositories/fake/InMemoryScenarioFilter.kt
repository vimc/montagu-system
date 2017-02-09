package uk.ac.imperial.vimc.demo.app.repositories.fake

import uk.ac.imperial.vimc.demo.app.filters.InMemoryFilter
import uk.ac.imperial.vimc.demo.app.filters.InMemoryFilterAdapter
import uk.ac.imperial.vimc.demo.app.filters.Mapper
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.models.ImpactEstimateDescription

class InMemoryScenarioFilter(parameters: ScenarioFilterParameters) : InMemoryFilter<ScenarioFilterParameters, Scenario>(parameters) {
    override val mappers = listOf<Mapper<ScenarioFilterParameters, Scenario, String?>>(
            Mapper({ it.scenarioId }, { it.id }),
            Mapper({ it.disease }, { it.disease }),
            Mapper({ it.vaccine }, { it.vaccine }),
            Mapper({ it.vaccinationLevel }, { it.vaccinationLevel }),
            Mapper({ it.scenarioType }, { it.scenarioType })
    )
}

class InMemoryModellingGroupFilter(parameters: ScenarioFilterParameters)
    : InMemoryFilterAdapter<ScenarioFilterParameters, ImpactEstimateDescription, Scenario>(parameters, { it.scenario }, InMemoryScenarioFilter(parameters))