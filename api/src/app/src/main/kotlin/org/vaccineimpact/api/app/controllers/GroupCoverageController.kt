package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.models.CoverageRow
import org.vaccineimpact.api.models.LongCoverageRow
import org.vaccineimpact.api.models.ScenarioTouchstoneAndCoverageSets
import org.vaccineimpact.api.models.WideCoverageRow
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.serialization.StreamSerializable

class GroupCoverageController(
        actionContext: ActionContext,
        private val repo: ModellingGroupRepository
) : Controller(actionContext)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.modellingGroup)

    fun getCoverageSets(): ScenarioTouchstoneAndCoverageSets
    {
        val path = ResponsibilityPath(context)
        val data = repo.getCoverageSets(path.groupId, path.touchstoneId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneId, data.touchstone.status)
        return data
    }

    fun getCoverageData(): StreamSerializable<CoverageRow>
    {
        val data = getCoverageDataAndMetadata()
        val metadata = data.structuredMetadata
        val filename = "coverage_${metadata.touchstone.id}_${metadata.scenario.id}.csv"
        context.addAttachmentHeader(filename)
        return data.tableData
    }

    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun getCoverageDataAndMetadata(): SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val path = ResponsibilityPath(context)
        val splitData = repo.getCoverageData(path.groupId, path.touchstoneId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneId, splitData.structuredMetadata.touchstone.status)

        val format = context.queryParams("format")

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