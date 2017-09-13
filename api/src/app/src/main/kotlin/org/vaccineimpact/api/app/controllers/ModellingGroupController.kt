package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.csvData
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import spark.route.HttpMethod
import java.time.Instant

open class ModellingGroupController(context: ControllerContext)
    : AbstractController(context)
{
    override val urlComponent = "/modelling-groups"
    private val groupScope = "modelling-group:<group-id>"
    val responsibilityPermissions = setOf(
            "*/scenarios.read",
            "$groupScope/responsibilities.read"
    )
    val coveragePermissions = responsibilityPermissions + "$groupScope/coverage.read"
    val responsibilitiesURL = "/:group-id/responsibilities/:touchstone-id"
    val scenarioURL = "$responsibilitiesURL/:scenario-id"
    val coverageURL = "$scenarioURL/coverage"

    override fun endpoints(repos: Repositories): Iterable<EndpointDefinition<*>>
    {
        val repo = repos.modellingGroup
        return listOf(
                oneRepoEndpoint("/",                           this::getModellingGroups, repo).secured(setOf("*/modelling-groups.read")),
                oneRepoEndpoint("/:group-id/",                 this::getModellingGroup, repo).secured(setOf("*/modelling-groups.read", "*/models.read")),
                oneRepoEndpoint("$responsibilitiesURL/",       this::getResponsibilities, repo).secured(responsibilityPermissions),
                oneRepoEndpoint("$scenarioURL/",               this::getResponsibility, repo).secured(responsibilityPermissions),
                oneRepoEndpoint("$scenarioURL/coverage_sets/", this::getCoverageSets, repo).secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/",               this::getCoverageDataAndMetadata, repo, contentType = "application/json").secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/",               this::getCoverageData, repo, contentType = "text/csv").secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.COVERAGE) }, repos.token).secured(coveragePermissions),
                oneRepoEndpoint("$scenarioURL/estimates/",     this::addBurdenEstimate, repos.burdenEstimates, method = HttpMethod.post)
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read"))
        )
    }

    @Suppress("UNUSED_PARAMETER")
    fun getModellingGroups(context: ActionContext, repo: ModellingGroupRepository): List<ModellingGroup>
    {
        return repo.getModellingGroups().toList()
    }

    fun getModellingGroup(context: ActionContext, repo: ModellingGroupRepository): ModellingGroupDetails
    {
        val groupId = groupId(context)
        return repo.getModellingGroupDetails(groupId)
    }

    fun getResponsibilities(context: ActionContext, repo: ModellingGroupRepository): Responsibilities
    {
        val groupId = groupId(context)
        val touchstoneId = context.params(":touchstone-id")
        val filterParameters = ScenarioFilterParameters.fromContext(context)

        val data = repo.getResponsibilities(groupId, touchstoneId, filterParameters)
        checkTouchstoneStatus(data.touchstoneStatus, touchstoneId, context)
        return data.responsibilities
    }

    fun getResponsibility(context: ActionContext, repo: ModellingGroupRepository): ResponsibilityAndTouchstone
    {
        val path = ResponsibilityPath(context)
        val data = repo.getResponsibility(path.groupId, path.touchstoneId, path.scenarioId)
        checkTouchstoneStatus(data.touchstone.status, path.touchstoneId, context)
        return data
    }

    fun getCoverageSets(context: ActionContext, repo: ModellingGroupRepository): ScenarioTouchstoneAndCoverageSets
    {
        val path = ResponsibilityPath(context)
        val data = repo.getCoverageSets(path.groupId, path.touchstoneId, path.scenarioId)
        checkTouchstoneStatus(data.touchstone.status, path.touchstoneId, context)
        return data
    }

    open fun getCoverageData(context: ActionContext, repo: ModellingGroupRepository): DataTable<CoverageRow>
    {
        val data = getCoverageDataAndMetadata(context, repo)
        val metadata = data.structuredMetadata
        val filename = "coverage_${metadata.touchstone.id}_${metadata.scenario.id}.csv"
        context.addAttachmentHeader(filename)
        return data.tableData
    }

    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun getCoverageDataAndMetadata(context: ActionContext, repo: ModellingGroupRepository): SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val path = ResponsibilityPath(context)
        val data = repo.getCoverageData(path.groupId, path.touchstoneId, path.scenarioId)
        checkTouchstoneStatus(data.structuredMetadata.touchstone.status, path.touchstoneId, context)
        return data
    }

    open fun addBurdenEstimate(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
    {
        val path = ResponsibilityPath(context)

        // First check if we're allowed to see this touchstone
        val touchstone = estimateRepository.touchstoneRepository.touchstones.get(path.touchstoneId)
        checkTouchstoneStatus(touchstone.status, path.touchstoneId, context)

        // Then add the burden estimates
        val data = context.csvData<BurdenEstimate>()
        val id = estimateRepository.addBurdenEstimateSet(
                path.groupId, path.touchstoneId, path.scenarioId,
                data,
                uploader = context.username!!,
                timestamp = Instant.now()
        )
        val url = "/modelling-groups/${path.groupId}/responsibilities/${path.touchstoneId}/${path.scenarioId}/estimates/$id/"
        return objectCreation(context, url)
    }

    private fun checkTouchstoneStatus(
            touchstoneStatus: TouchstoneStatus,
            touchstoneId: String,
            context: ActionContext)
    {
        if (touchstoneStatus == TouchstoneStatus.IN_PREPARATION && !context.hasPermission(ReifiedPermission("touchstones.prepare", Scope.Global())))
        {
            throw UnknownObjectError(touchstoneId, "Touchstone")
        }
    }

    // We are sure that this will be non-null, as its part of the URL,
    // and Spark wouldn't have mapped us here if it were blank
    private fun groupId(context: ActionContext): String = context.params(":group-id")
}

// Everything needed to precisely specify one responsibility
data class ResponsibilityPath(val groupId: String, val touchstoneId: String, val scenarioId: String)
{
    constructor(context: ActionContext)
            : this(context.params(":group-id"), context.params(":touchstone-id"), context.params(":scenario-id"))
}
