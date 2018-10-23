package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.DataTable
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.SplitData

interface CoverageLogic
{
    fun getCoverageData(touchstoneVersionId: String, scenarioId: String, format: String?)
            : SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>

    fun getCoverageDataForGroup(groupId: String, touchstoneVersionId: String, scenarioId: String,
                                allCountries: Boolean, format: String?)
            : SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>

    fun getCoverageSetsForGroup(groupId: String, touchstoneVersionId: String, scenarioId: String):
            ScenarioTouchstoneAndCoverageSets

}

class RepositoriesCoverageLogic(private val modellingGroupRepository: ModellingGroupRepository,
                                private val responsibilitiesRepository: ResponsibilitiesRepository,
                                private val touchstoneRepository: TouchstoneRepository,
                                private val scenarioRepository: ScenarioRepository) : CoverageLogic
{
    override fun getCoverageSetsForGroup(groupId: String, touchstoneVersionId: String, scenarioId: String):
            ScenarioTouchstoneAndCoverageSets
    {
        modellingGroupRepository.getModellingGroup(groupId)
        // We don't use the returned responsibility, but by using this method we check that the group exists
        // and that the group is responsible for the given scenario in the given touchstoneVersion
        val responsibilityAndTouchstone = responsibilitiesRepository.getResponsibility(groupId, touchstoneVersionId, scenarioId)
        val scenarioAndCoverageSets = touchstoneRepository.getScenarioAndCoverageSets(touchstoneVersionId, scenarioId)
        return ScenarioTouchstoneAndCoverageSets(
                responsibilityAndTouchstone.touchstoneVersion,
                scenarioAndCoverageSets.scenario,
                scenarioAndCoverageSets.coverageSets)
    }

    constructor(repositories: Repositories) : this(repositories.modellingGroup,
            repositories.responsibilities,
            repositories.touchstone,
            repositories.scenario)

    override fun getCoverageDataForGroup(groupId: String, touchstoneVersionId: String, scenarioId: String,
                                         allCountries: Boolean, format: String?)
            : SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        modellingGroupRepository.getModellingGroup(groupId)
        val responsibilityAndTouchstone =
                responsibilitiesRepository.getResponsibility(groupId, touchstoneVersionId, scenarioId)

        val scenario = scenarioRepository.getScenarioForTouchstone(touchstoneVersionId, scenarioId)
        val coverageSets = touchstoneRepository.getCoverageSetsForScenario(touchstoneVersionId, scenarioId)

        val data = if (allCountries)
        {
            touchstoneRepository.getCoverageDataForScenario(touchstoneVersionId, scenarioId)
        }
        else
        {
            touchstoneRepository.getCoverageDataForResponsibility(
                    touchstoneVersionId,
                    responsibilityAndTouchstone.responsibilityId,
                    scenario.id)
        }

        val splitData = SplitData(ScenarioTouchstoneAndCoverageSets(
                responsibilityAndTouchstone.touchstoneVersion,
                scenario,
                coverageSets
        ), DataTable.new(data))

        return getDatatable(splitData, format)
    }

    override fun getCoverageData(touchstoneVersionId: String, scenarioId: String, format: String?)
            : SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val touchstoneVersion = touchstoneRepository.touchstoneVersions.get(touchstoneVersionId)
        val scenarioAndData = touchstoneRepository.getScenarioAndCoverageData(touchstoneVersionId, scenarioId)
        val splitData = SplitData(ScenarioTouchstoneAndCoverageSets(
                touchstoneVersion,
                scenarioAndData.structuredMetadata.scenario,
                scenarioAndData.structuredMetadata.coverageSets
        ), scenarioAndData.tableData)
        return getDatatable(splitData, format)
    }

    private fun getDatatable(splitData: SplitData<ScenarioTouchstoneAndCoverageSets, LongCoverageRow>,
                             format: String?)
            : SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val tableData = when (format)
        {

            "wide" -> getWideDatatable(splitData.tableData.data)
            "long", null -> splitData.tableData
            else -> throw BadRequest("Format '$format' not a valid csv format. Available formats are 'long' " +
                    "and 'wide'.")
        }

        return SplitData(splitData.structuredMetadata, tableData)
    }

    private fun getWideDatatable(data: Sequence<LongCoverageRow>):
            FlexibleDataTable<WideCoverageRow>
    {
        val groupedRows = data
                .groupBy {
                    hashSetOf(
                            it.countryCode, it.setName,
                            it.ageFirst, it.ageLast,
                            it.vaccine, it.gaviSupport, it.activityType
                    )
                }

        val rows = groupedRows.values
                .map {
                    mapWideCoverageRow(it)
                }


        // all the rows should have the same number of years, so we just look at the first row
        val years = if (rows.any())
        {
            rows.first().coverageAndTargetPerYear.keys.toList()
        }
        else
        {
            listOf()
        }

        return FlexibleDataTable.new(rows.asSequence(), years.sorted())

    }

    private fun mapWideCoverageRow(records: List<LongCoverageRow>)
            : WideCoverageRow
    {
        // all records have same country, gender, age_from and age_to, so can look at first one for these
        val reference = records.first()

        val coverageAndTargetPerYear =
                records.associateBy({ "coverage_${it.year}" }, { it.coverage }) +
                        records.associateBy({ "target_${it.year}" }, { it.target })

        return WideCoverageRow(reference.scenario,
                reference.setName,
                reference.vaccine,
                reference.gaviSupport,
                reference.activityType,
                reference.countryCode,
                reference.country,
                reference.ageFirst,
                reference.ageLast,
                reference.ageRangeVerbatim,
                coverageAndTargetPerYear)
    }

}