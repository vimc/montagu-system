package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.csvData
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.DataTableDeserializer
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import spark.route.HttpMethod
import java.time.Instant
import javax.servlet.MultipartConfigElement


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

    override fun endpoints(repos: RepositoryFactory): Iterable<EndpointDefinition<*>>
    {
        val repo: (Repositories) -> ModellingGroupRepository = { it.modellingGroup }
        return listOf(
                oneRepoEndpoint("/", this::getModellingGroups, repos, repo).secured(setOf("*/modelling-groups.read")),
                oneRepoEndpoint("/:group-id/", this::getModellingGroup, repos, repo).secured(setOf("*/modelling-groups.read", "*/models.read")),
                oneRepoEndpoint("$responsibilitiesURL/", this::getResponsibilities, repos, repo).secured(responsibilityPermissions),
                oneRepoEndpoint("$scenarioURL/", this::getResponsibility, repos, repo).secured(responsibilityPermissions),
                oneRepoEndpoint("$scenarioURL/coverage_sets/", this::getCoverageSets, repos, repo).secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/", this::getCoverageDataAndMetadata, repos, repo, contentType = "application/json").secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/", this::getCoverageData, repos, repo, contentType = "text/csv").secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.COVERAGE) }, repos, { it.token }).secured(coveragePermissions),
                oneRepoEndpoint("$scenarioURL/estimates/", this::addBurdenEstimate, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read")),
                oneRepoEndpoint("$scenarioURL/estimates/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.BURDENS) }, repos, { it.token })
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

    fun postBurdenEstimates(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)

        val request = context.request
        if (request.raw().getAttribute("org.eclipse.jetty.multipartConfig") == null)
        {
            val multipartConfigElement = MultipartConfigElement(System.getProperty("java.io.tmpdir"))
            request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement)
        }

        request.raw().getPart("file").inputStream.bufferedReader().use {

            // Then add the burden estimates
            val data = DataTableDeserializer.deserialize(it.readText(), BurdenEstimate::class, Serializer.instance).toList()
            return uploadBurdenEstimates(data, estimateRepository, context, path)
        }

    }

    fun modifyMembership(context: ActionContext, repo: ModellingGroupRepository)
    {


    }

    open fun addBurdenEstimate(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)

        // Then add the burden estimates
        val data = context.csvData<BurdenEstimate>()
        return uploadBurdenEstimates(data, estimateRepository, context, path)
    }

    private fun getValidResponsibilityPath(context: ActionContext, estimateRepository: BurdenEstimateRepository): ResponsibilityPath
    {
        val path = ResponsibilityPath(context)

        val touchstone = estimateRepository.touchstoneRepository.touchstones.get(path.touchstoneId)
        checkTouchstoneStatus(touchstone.status, path.touchstoneId, context)

        return path
    }

    private fun uploadBurdenEstimates(data: List<BurdenEstimate>,
                                      estimateRepository: BurdenEstimateRepository,
                                      context: ActionContext,
                                      path: ResponsibilityPath): String
    {
        if (data.map { it.disease }.distinct().count() > 1)
        {
            throw InconsistentDataError("More than one value was present in the disease column")
        }

        val id = estimateRepository.addBurdenEstimateSet(
                path.groupId, path.touchstoneId, path.scenarioId,
                data,
                uploader = context.username!!,
                timestamp = Instant.now()
        )
        val url = "/${path.groupId}/responsibilities/${path.touchstoneId}/${path.scenarioId}/estimates/$id/"
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
