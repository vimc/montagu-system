package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.logic.CoverageLogic
import org.vaccineimpact.api.app.logic.RepositoriesCoverageLogic
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.requests.PostDataHelper
import org.vaccineimpact.api.app.requests.csvData
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.models.CoverageIngestionRow
import org.vaccineimpact.api.models.CoverageRow
import org.vaccineimpact.api.models.CoverageUploadMetadata
import org.vaccineimpact.api.models.ScenarioTouchstoneAndCoverageSets
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.serialization.StreamSerializable
import java.time.Instant
import org.vaccineimpact.api.serialization.*
import kotlin.reflect.full.primaryConstructor

class CoverageController(
        actionContext: ActionContext,
        private val coverageLogic: CoverageLogic,
        private val touchstoneRepository: TouchstoneRepository,
        private val postDataHelper: PostDataHelper = PostDataHelper()
) : Controller(actionContext)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, RepositoriesCoverageLogic(repositories), repositories.touchstone)

    fun getCoverageUploadMetadata(): List<CoverageUploadMetadata>
    {
        val touchstoneVersionId = context.params(":touchstone-version-id")
        return touchstoneRepository.getCoverageUploadMetadata(touchstoneVersionId)
    }

    fun getCoverageUploadTemplate(): String
    {
        val filename = "coverage_template.csv"
        context.addAttachmentHeader(filename)
        return CoverageIngestionRow::class.primaryConstructor!!.parameters.map {
            "\"${MontaguSerializer.instance.convertFieldName(it.name!!)}\""
        }.joinToString(", ")
    }

    fun getCoverageDataFromCSV(): Pair<Sequence<CoverageIngestionRow>, String>
    {
        val parts = context.getParts()
        val description = parts["description"].contents
        val sequence = postDataHelper.csvData<CoverageIngestionRow>(parts["file"])
        return Pair(sequence, description)
    }

    fun ingestCoverage(): String
    {
        val data = getCoverageDataFromCSV()
        val touchstone = context.params(":touchstone-version-id")
        coverageLogic.saveCoverageForTouchstone(touchstone, data.first, data.second, context.username!!, Instant.now())
        return okayResponse()
    }

    fun getCoverageSetsForGroup(): ScenarioTouchstoneAndCoverageSets
    {
        val path = ResponsibilityPath(context)
        val data = coverageLogic.getCoverageSetsForGroup(path.groupId, path.touchstoneVersionId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneVersionId, data.touchstoneVersion.status)
        return data
    }

    fun getCoverageDataForGroup(): StreamSerializable<CoverageRow>
    {
        return addAttachmentHeaderAndReturn(getCoverageDataAndMetadataForGroup())
    }

    fun getCoverageDataForTouchstoneVersion(): StreamSerializable<CoverageRow>
    {
        return addAttachmentHeaderAndReturn(getCoverageDataAndMetadataForTouchstoneVersion())
    }

    private fun addAttachmentHeaderAndReturn(data: SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>)
            : StreamSerializable<CoverageRow>
    {
        val metadata = data.structuredMetadata
        val filename = "coverage_${metadata.touchstoneVersion.id}_${metadata.scenario.id}.csv"
        context.addAttachmentHeader(filename)
        return data.tableData
    }

    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun getCoverageDataAndMetadataForGroup(): SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val path = ResponsibilityPath(context)
        val format = context.queryParams("format")
        val allCountries = context.queryParams("all-countries")?.toBoolean() ?: false
        val splitData = coverageLogic.getCoverageDataForGroup(path.groupId,
                path.touchstoneVersionId, path.scenarioId, format = format, allCountries = allCountries)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneVersionId, splitData.structuredMetadata.touchstoneVersion.status)
        return splitData
    }

    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun getCoverageDataAndMetadataForTouchstoneVersion(): SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val touchstoneVersionId = context.params(":touchstone-version-id")
        val scenarioId = context.params(":scenario-id")
        val format = context.queryParams("format")
        val splitData = coverageLogic.getCoverageData(touchstoneVersionId, scenarioId, format)
        context.checkIsAllowedToSeeTouchstone(touchstoneVersionId, splitData.structuredMetadata.touchstoneVersion.status)
        return splitData
    }

}