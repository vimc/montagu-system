package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.models.CoverageRow
import org.vaccineimpact.api.models.DemographicStatisticType
import org.vaccineimpact.api.models.ScenarioAndCoverageSets
import org.vaccineimpact.api.models.Touchstone

interface TouchstoneRepository : Repository
{
    val touchstones: SimpleDataSet<Touchstone, String>
    fun scenarios(touchstoneId: String, filterParams: ScenarioFilterParameters): List<ScenarioAndCoverageSets>
    fun getScenario(touchstoneId: String, scenarioDescId: String): ScenarioAndCoverageSets
    fun getScenarioAndCoverageData(touchstoneId: String, scenarioDescId: String): SplitData<ScenarioAndCoverageSets, CoverageRow>
    fun getDemographicStatisticTypes(touchstoneId: String): List<DemographicStatisticType>
    fun getDemographicDataset(statisticType: String, touchstoneId: String): Any
}