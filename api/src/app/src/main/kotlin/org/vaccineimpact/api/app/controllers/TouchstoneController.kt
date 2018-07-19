package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.security.filterByPermission
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySet
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.serialization.StreamSerializable

class TouchstoneController(
        context: ActionContext,
        private val responsibilitiesRepository: ResponsibilitiesRepository,
        private val touchstoneRepo: TouchstoneRepository
) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.responsibilities, repositories.touchstone)

    private val touchstonePreparer = ReifiedPermission("touchstones.prepare", Scope.Global())

    fun getTouchstones(): List<Touchstone>
    {
        return touchstoneRepo.getTouchstones().filterByPermission(context)
    }

    fun getScenarios(): List<ScenarioAndCoverageSets>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        val filterParameters = ScenarioFilterParameters.fromContext(context)
        return touchstoneRepo.scenarios(touchstoneVersion.id, filterParameters)
    }

    fun getResponsibilities(): List<ResponsibilitySet>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        return responsibilitiesRepository.getResponsibilitiesForTouchstone(touchstoneVersion.id)
    }

    fun getDemographicDatasets(): List<DemographicDataset>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        return touchstoneRepo.getDemographicDatasets(touchstoneVersion.id)
    }

    fun getDemographicDataAndMetadata():
            SplitData<DemographicDataForTouchstone, DemographicRow>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        val source = context.params(":source-code")
        val type = context.params(":type-code")
        val gender = context.queryParams("gender")
        val format = context.queryParams("format")

        val splitData = touchstoneRepo.getDemographicData(type, source, touchstoneVersion.id, gender ?: "both")

        val tableData = when (format)
        {

            "wide" -> getWideDemographicDatatable(splitData.tableData.data)
            "long", null -> splitData.tableData
            else -> throw BadRequest("Format '$format' not a valid csv format. Available formats are 'long' " +
                    "and 'wide'.")
        }

        return SplitData(splitData.structuredMetadata, tableData)
    }

    private fun getWideDemographicDatatable(data: Sequence<LongDemographicRow>):
            FlexibleDataTable<WideDemographicRow>
    {
        val groupedRows = data
                .groupBy { Triple(it.countryCode, it.ageFrom, it.ageTo) }

        val rows = groupedRows.values
                .map {
                    mapWideDemographicRow(it)
                }

        // all the rows should have the same number of years, so we just look at the first row
        val years = rows.first().valuesPerYear.keys.toList()

        return FlexibleDataTable.new(rows.asSequence(), years)
    }

    fun getDemographicData()
            : StreamSerializable<DemographicRow>
    {
        val data = getDemographicDataAndMetadata()
        val metadata = data.structuredMetadata
        val source = context.params(":source-code")
        val gender = context.queryParams("gender") ?: "both"
        val filename = "${metadata.touchstoneVersion.id}_${source}_${metadata.demographicData.id}_$gender.csv"
        context.addAttachmentHeader(filename)

        return data.tableData
    }

    private fun mapWideDemographicRow(records: List<LongDemographicRow>)
            : WideDemographicRow
    {
        // all records have same country, gender, age_from and age_to, so can look at first one for these
        val reference = records.first()

        val valuesPerYear = records.associateBy(
                { it.year },
                { it.value })

        return WideDemographicRow(reference.countryCodeNumeric,
                reference.countryCode,
                reference.country,
                reference.ageFrom,
                reference.ageTo,
                reference.gender,
                valuesPerYear)
    }

    fun getScenario(): ScenarioTouchstoneAndCoverageSets
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        val scenarioId: String = context.params(":scenario-id")
        val data = touchstoneRepo.getScenario(touchstoneVersion.id, scenarioId)
        return ScenarioTouchstoneAndCoverageSets(touchstoneVersion, data.scenario, data.coverageSets)
    }

    private fun touchstoneVersion(context: ActionContext, repo: TouchstoneRepository): TouchstoneVersion
    {
        val id = context.params(":touchstone-version-id")
        val touchstoneVersion = repo.touchstoneVersions.get(id)
        if (touchstoneVersion.status == TouchstoneStatus.IN_PREPARATION)
        {
            context.requirePermission(touchstonePreparer)
        }
        return touchstoneVersion
    }
}