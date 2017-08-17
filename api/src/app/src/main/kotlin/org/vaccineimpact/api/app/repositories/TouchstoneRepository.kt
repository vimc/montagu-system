package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.models.*

interface TouchstoneRepository : Repository
{
    val touchstones: SimpleDataSet<Touchstone, String>
    fun scenarios(touchstoneId: String, filterParams: ScenarioFilterParameters): List<ScenarioAndCoverageSets>
    fun getScenario(touchstoneId: String, scenarioDescId: String): ScenarioAndCoverageSets
    fun getScenarioAndCoverageData(touchstoneId: String, scenarioDescId: String): SplitData<ScenarioAndCoverageSets, CoverageRow>
    fun getDemographicStatisticTypes(touchstoneId: String): List<DemographicStatisticType>
    fun getDemographicDataset(statisticTypeCode: String, source: String, touchstoneId: String, genderCode: String = "B"): SplitData<DemographicDataForTouchstone, DemographicRow>
}