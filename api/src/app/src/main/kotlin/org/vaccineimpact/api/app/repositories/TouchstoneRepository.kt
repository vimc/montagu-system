package org.vaccineimpact.api.app.repositories

import org.jooq.Record
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.SplitData

interface TouchstoneRepository : Repository
{
    fun getTouchstones(): List<Touchstone>
    val touchstoneVersions: SimpleDataSet<TouchstoneVersion, String>

    fun scenarios(touchstoneVersionId: String, filterParams: ScenarioFilterParameters): List<ScenarioAndCoverageSets>
    fun getScenario(touchstoneVersionId: String, scenarioDescId: String): ScenarioAndCoverageSets
    fun getScenarioAndCoverageData(touchstoneVersionId: String, scenarioDescId: String): SplitData<ScenarioAndCoverageSets, LongCoverageRow>
    fun getDemographicDatasets(touchstoneVersionId: String): List<DemographicDataset>
    fun getDemographicData(statisticTypeCode: String, source: String, touchstoneVersionId: String, gender: String = "both"): SplitData<DemographicDataForTouchstone, LongDemographicRow>

    fun mapTouchstone(records: List<Record>): Touchstone
    fun mapTouchstoneVersion(record: Record): TouchstoneVersion
}