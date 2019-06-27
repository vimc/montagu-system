package org.vaccineimpact.api.app.repositories

import org.jooq.Record
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.db.tables.Coverage
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.Serializer
import org.vaccineimpact.api.serialization.SplitData

interface TouchstoneRepository : Repository
{
    fun getTouchstones(): List<Touchstone>
    val touchstoneVersions: SimpleDataSet<TouchstoneVersion, String>

    fun getScenariosAndCoverageSets(touchstoneVersionId: String, filterParams: ScenarioFilterParameters): List<ScenarioAndCoverageSets>
    fun getScenarioAndCoverageSets(touchstoneVersionId: String, scenarioDescId: String): ScenarioAndCoverageSets
    fun getScenarioAndCoverageData(touchstoneVersionId: String, scenarioDescId: String): SplitData<ScenarioAndCoverageSets, LongCoverageRow>

    fun getCoverageDataForResponsibility(
            touchstoneVersionId: String,
            responsibilityId: Int,
            scenarioDescriptionId: String
    ): Sequence<LongCoverageRow>

    fun getCoverageDataForScenario(
            touchstoneVersionId: String,
            scenarioDescriptionId: String
    ): Sequence<LongCoverageRow>

    fun getCoverageSetsForScenario(
            touchstoneVersionId: String,
            scenarioDescriptionId: String)
            : List<CoverageSet>

    fun getDemographicDatasets(touchstoneVersionId: String): List<DemographicDataset>
    fun getDemographicData(statisticTypeCode: String, source: String,
                           touchstoneVersionId: String,
                           gender: String = "both",
                           serializer: Serializer): SplitData<DemographicDataForTouchstone, LongDemographicRow>

    fun mapTouchstone(records: List<Record>): Touchstone
    fun mapTouchstoneVersion(record: Record): TouchstoneVersion
}