package org.vaccineimpact.api.app.logic

import okhttp3.internal.userAgent
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.getLongCoverageRowDataTable
import org.vaccineimpact.api.app.getWideCoverageRowDataTable
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.SplitData
import java.math.BigDecimal

interface CoverageLogic
{
    fun getCoverageData(touchstoneVersionId: String, scenarioId: String, format: String?)
            : SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>

    fun getCoverageDataForGroup(groupId: String, touchstoneVersionId: String, scenarioId: String,
                                allCountries: Boolean, format: String?)
            : SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>

    fun getCoverageSetsForGroup(groupId: String, touchstoneVersionId: String, scenarioId: String):
            ScenarioTouchstoneAndCoverageSets

    fun saveCoverageForTouchstone(touchstoneVersionId: String, rows: Sequence<CoverageIngestionRow>)
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

    override fun saveCoverageForTouchstone(touchstoneVersionId: String, rows: Sequence<CoverageIngestionRow>)
    {
        val genders = touchstoneRepository.getGenders()
        val setDeterminants = mutableListOf<Triple<ActivityType, GAVISupportLevel, String>>()
        val setIds = mutableListOf<Int>()
        val records = rows.map {
            val set = Triple(it.activityType, it.gaviSupport, it.vaccine)
            var setIndex = setDeterminants.indexOf(set)
            if (setIndex == -1)
            {
                val newId = touchstoneRepository.createCoverageSet(touchstoneVersionId, it.vaccine, it.activityType, it.gaviSupport)
                setIds.add(newId)
                setDeterminants.add(set)
                setIndex = setIds.count() - 1
            }
            val id = setIds[setIndex]
            touchstoneRepository.newCoverageRowRecord(
                    id,
                    it.country,
                    it.year,
                    ageFrom = BigDecimal(it.ageFirst),
                    ageTo = BigDecimal(it.ageLast),
                    gender = genders[it.gender]!!,
                    target = it.target.toBigDecimal(),
                    coverage = it.coverage.toBigDecimal()
            )
        }.toList()
        touchstoneRepository.saveCoverageForTouchstone(touchstoneVersionId, records)
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

        val dataTable = getLongCoverageRowDataTable(data)

        val splitData = SplitData(ScenarioTouchstoneAndCoverageSets(
                responsibilityAndTouchstone.touchstoneVersion,
                scenario,
                coverageSets
        ), dataTable)

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
            FlexibleDataTable<out WideCoverageRow>
    {
        val groupedRows = data
                .groupBy {
                    if (it is GenderedLongCoverageRow)
                    {
                        hashSetOf(
                                it.countryCode, it.setName,
                                it.ageFirst, it.ageLast, it.ageRangeVerbatim,
                                it.vaccine, it.gaviSupport, it.activityType,
                                it.gender
                        )
                    }
                    else
                    {
                        hashSetOf(
                                it.countryCode, it.setName,
                                it.ageFirst, it.ageLast, it.ageRangeVerbatim,
                                it.vaccine, it.gaviSupport, it.activityType
                        )
                    }
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

        return getWideCoverageRowDataTable(rows.asSequence(), years.sorted())

    }

    private fun mapWideCoverageRow(records: List<LongCoverageRow>)
            : WideCoverageRow
    {
        // all records have same country, gender, age_from and age_to, so can look at first one for these
        val reference = records.first()

        val coverageAndTargetPerYear =
                records.associateBy({ "coverage_${it.year}" }, { it.coverage }) +
                        records.associateBy({ "target_${it.year}" }, { it.target })

        if (reference is GenderedLongCoverageRow)
        {
            return GenderedWideCoverageRow(reference.scenario,
                    reference.setName,
                    reference.vaccine,
                    reference.gaviSupport,
                    reference.activityType,
                    reference.countryCode,
                    reference.country,
                    reference.ageFirst,
                    reference.ageLast,
                    reference.ageRangeVerbatim,
                    reference.gender,
                    coverageAndTargetPerYear)
        }
        else
        {
            return NoGenderWideCoverageRow(reference.scenario,
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

}