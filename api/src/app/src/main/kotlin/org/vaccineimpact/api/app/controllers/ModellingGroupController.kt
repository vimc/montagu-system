package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.controllers.endpoints.streamed
import org.vaccineimpact.api.app.csvData
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.postData
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.app.serialization.*
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
                oneRepoEndpoint("$coverageURL/", this::getCoverageDataAndMetadata.streamed(), repos, repo, contentType = "application/json").secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/", this::getCoverageData.streamed(), repos, repo, contentType = "text/csv").secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.COVERAGE) }, repos, { it.token }).secured(coveragePermissions),
                oneRepoEndpoint("$scenarioURL/estimates/", this::addBurdenEstimates, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read")),
                oneRepoEndpoint("$scenarioURL/estimates/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.BURDENS) }, repos, { it.token })
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read")),
                oneRepoEndpoint("/:group-id/actions/associate_member/", this::modifyMembership, repos, {it.user}, method = HttpMethod.post).secured()
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

    open fun getCoverageData(context: ActionContext, repo: ModellingGroupRepository): StreamSerializable<CoverageRow>
    {
        val data = getCoverageDataAndMetadata(context, repo)
        val metadata = data.structuredMetadata
        val filename = "coverage_${metadata.touchstone.id}_${metadata.scenario.id}.csv"
        context.addAttachmentHeader(filename)
        return data.tableData
    }

    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun getCoverageDataAndMetadata(context: ActionContext, repo: ModellingGroupRepository):
            SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val path = ResponsibilityPath(context)
        val splitData = repo.getCoverageData(path.groupId, path.touchstoneId, path.scenarioId)
        checkTouchstoneStatus(splitData.structuredMetadata.touchstone.status, path.touchstoneId, context)

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

    private fun getWideDatatable(data: Iterable<LongCoverageRow>):
            FlexibleDataTable<WideCoverageRow>
    {
        val groupedRows = data
                .groupBy { hashSetOf(
                        it.countryCode, it.setName,
                        it.ageFirst, it.ageLast,
                        it.vaccine, it.gaviSupport, it.activityType
                )}

        val rows = groupedRows.values
                .map {
                    mapWideCoverageRow(it)
                }

        // all the rows should have the same number of years, so we just look at the first row
        val years = rows.first().coverageAndTargetPerYear.keys.toList()

        return FlexibleDataTable.new(rows, years)
    }

    private fun mapWideCoverageRow(records: List<LongCoverageRow>)
            : WideCoverageRow
    {
        // all records have same country, gender, age_from and age_to, so can look at first one for these
        val reference = records.first()

        val coverageAndTargetPerYear = records.associateBy(
                { "${it.year}_coverage" },
                { it.coverage }).plus(records.associateBy(
                { "${it.year}_target" },
                { it.coverage }))

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

    fun modifyMembership(context: ActionContext, repo: UserRepository): String
    {
        val associateUser = context.postData<AssociateUser>()

        val groupId = context.params(":group-id")
        val scope = Scope.parse("modelling-group:${groupId}")

        val managingScopes = managingScopes(context)

        if (!managingScopes.any({ it.encompasses(scope) }))
        {
            throw MissingRequiredPermissionError(setOf("${scope}/modelling-groups.manage-members"))
        }

        repo.modifyMembership(groupId, associateUser)

        return okayResponse()
    }

    private fun managingScopes(context: ActionContext) = context.permissions
            .filter { it.name == "modelling-groups.manage-members" }
            .map { it.scope }

    fun addBurdenEstimatesFromHTMLForm(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
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
            return saveBurdenEstimates(data, estimateRepository, context, path)
        }
    }

    open fun addBurdenEstimates(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)

        // Then add the burden estimates
        val data = context.csvData<BurdenEstimate>()
        return saveBurdenEstimates(data, estimateRepository, context, path)
    }

    private fun saveBurdenEstimates(data: List<BurdenEstimate>,
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

    private fun getValidResponsibilityPath(context: ActionContext, estimateRepository: BurdenEstimateRepository): ResponsibilityPath
    {
        val path = ResponsibilityPath(context)
        val touchstoneId = path.touchstoneId
        val touchstones = estimateRepository.touchstoneRepository.touchstones
        val touchstone = touchstones.get(touchstoneId)
        checkTouchstoneStatus(touchstone.status, path.touchstoneId, context)

        return path
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
