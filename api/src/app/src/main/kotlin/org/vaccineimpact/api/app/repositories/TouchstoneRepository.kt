package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.models.ScenarioAndCoverageSets
import org.vaccineimpact.api.models.Touchstone

interface TouchstoneRepository : Repository
{
    val touchstones: SimpleDataSet<Touchstone, String>
    fun scenarios(touchstoneId: String, filterParams: ScenarioFilterParameters): List<ScenarioAndCoverageSets>
    fun getScenario(touchstoneId: String, scenarioDescriptionId: String): ScenarioAndCoverageSets
}