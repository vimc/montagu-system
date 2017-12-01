package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.serialization.StreamSerializable

class TouchstoneController(
        context: ActionContext,
        private val repo: TouchstoneRepository
) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories, webTokenHelper: WebTokenHelper)
            : this(context, repositories.touchstone)

    private val touchstonePreparer = ReifiedPermission("touchstones.prepare", Scope.Global())

    fun getTouchstones(): List<Touchstone>
    {
        var touchstones = repo.touchstones.all()
        if (!context.hasPermission(touchstonePreparer))
        {
            touchstones = touchstones.filter { it.status != TouchstoneStatus.IN_PREPARATION }
        }
        return touchstones.toList()
    }

    fun getScenarios(): List<ScenarioAndCoverageSets>
    {
        val touchstone = touchstone(context, repo)
        val filterParameters = ScenarioFilterParameters.fromContext(context)
        return repo.scenarios(touchstone.id, filterParameters)
    }

    fun getDemographicDatasets(): List<DemographicDataset>
    {
        val touchstone = touchstone(context, repo)
        return repo.getDemographicDatasets(touchstone.id)
    }

    fun getDemographicDataAndMetadata():
            SplitData<DemographicDataForTouchstone, DemographicRow>
    {
        val touchstone = touchstone(context, repo)
        val source = context.params(":source-code")
        val type = context.params(":type-code")
        val gender = context.queryParams("gender")
        val format = context.queryParams("format")

        val splitData = repo.getDemographicData(type, source, touchstone.id, gender ?: "both")

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
        val filename = "${metadata.touchstone.id}_${source}_${metadata.demographicData.id}_$gender.csv"
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
        val touchstone = touchstone(context, repo)
        val scenarioId: String = context.params(":scenario-id")
        val data = repo.getScenario(touchstone.id, scenarioId)
        return ScenarioTouchstoneAndCoverageSets(touchstone, data.scenario, data.coverageSets)
    }

    private fun touchstone(context: ActionContext, repo: TouchstoneRepository): Touchstone
    {
        val id = context.params(":touchstone-id")
        val touchstone = repo.touchstones.get(id)
        if (touchstone.status == TouchstoneStatus.IN_PREPARATION)
        {
            context.requirePermission(touchstonePreparer)
        }
        return touchstone
    }
}