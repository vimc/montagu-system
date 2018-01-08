package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.csvData
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.controllers.endpoints.streamed
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.app.security.checkEstimatePermissionsForTouchstone
import org.vaccineimpact.api.app.security.isAllowedToSeeTouchstone
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.serialization.StreamSerializable
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
    val touchtonePermissions = setOf(
            "*/touchstones.read",
            "$groupScope/responsibilities.read"
    )
    val coveragePermissions = responsibilityPermissions + "$groupScope/coverage.read"
    val touchstonesURL = "/:group-id/responsibilities"
    val responsibilitiesURL = "/:group-id/responsibilities/:touchstone-id"
    val scenarioURL = "$responsibilitiesURL/:scenario-id"
    val coverageURL = "$scenarioURL/coverage"
    val parametersURL = "/:group-id/model-run-parameters/:touchstone-id"

    override fun endpoints(repos: RepositoryFactory): Iterable<EndpointDefinition<*>>
    {
        val repo: (Repositories) -> ModellingGroupRepository = { it.modellingGroup }
        return listOf(
                oneRepoEndpoint("/", this::getModellingGroups, repos, repo).secured(setOf("*/modelling-groups.read")),
                oneRepoEndpoint("/:group-id/", this::getModellingGroup, repos, repo).secured(setOf("*/modelling-groups.read", "*/models.read")),
                oneRepoEndpoint("$responsibilitiesURL/", this::getResponsibilities, repos, repo).secured(responsibilityPermissions),
                oneRepoEndpoint("$touchstonesURL/", this::getTouchstones, repos, repo).secured(touchtonePermissions),
                oneRepoEndpoint("$scenarioURL/", this::getResponsibility, repos, repo).secured(responsibilityPermissions),
                oneRepoEndpoint("$scenarioURL/coverage_sets/", this::getCoverageSets, repos, repo).secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/", this::getCoverageDataAndMetadata.streamed(), repos, repo, contentType = "application/json").secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/", this::getCoverageData.streamed(), repos, repo, contentType = "text/csv").secured(coveragePermissions),
                oneRepoEndpoint("$coverageURL/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.COVERAGE) }, repos, { it.token }).secured(coveragePermissions),
                oneRepoEndpoint("/:group-id/actions/associate_member/", this::modifyMembership, repos, { it.user }, method = HttpMethod.post).secured(),

                oneRepoEndpoint("$parametersURL/", this::getModelRunParameterSets, repos, { it.burdenEstimates })
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read")),

                oneRepoEndpoint("$parametersURL/", this::addModelRunParameters, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read")),

                oneRepoEndpoint("$parametersURL/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.MODEl_RUN_PARAMETERS) }, repos, { it.token })
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

    fun getModelRunParameterSets(context: ActionContext, estimateRepository: BurdenEstimateRepository): List<ModelRunParameterSet>
    {
        val touchstoneId = context.params(":touchstone-id")
        val groupId = context.params(":group-id")
        context.checkEstimatePermissionsForTouchstone(groupId, touchstoneId, estimateRepository)
        return estimateRepository.getModelRunParameterSets(groupId, touchstoneId)
    }

    fun addModelRunParameters(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
    {
        val touchstoneId = context.params(":touchstone-id")
        val groupId = context.params(":group-id")
        context.checkEstimatePermissionsForTouchstone(groupId, touchstoneId, estimateRepository)

        val parts = context.getParts()
        val disease = parts["disease"]
        val description = parts["description"]
        val modelRuns = context.csvData<ModelRun>(parts["file"])

        val id = estimateRepository.addModelRunParameterSet(groupId, touchstoneId, disease,
                description, modelRuns.toList(), context.username!!, Instant.now())

        return objectCreation(context, "$urlComponent/$groupId/model-run-parameters/$id/")
    }

    fun getResponsibilities(context: ActionContext, repo: ModellingGroupRepository): Responsibilities
    {
        val groupId = groupId(context)
        val touchstoneId = context.params(":touchstone-id")
        val filterParameters = ScenarioFilterParameters.fromContext(context)

        val data = repo.getResponsibilities(groupId, touchstoneId, filterParameters)
        context.checkIsAllowedToSeeTouchstone(touchstoneId, data.touchstoneStatus)
        return data.responsibilities
    }

    fun getTouchstones(context: ActionContext, repo: ModellingGroupRepository): List<Touchstone>
    {
        val groupId = groupId(context)

        var touchstones = repo.getTouchstonesByGroupId(groupId)
        touchstones = touchstones.filter { context.isAllowedToSeeTouchstone(it.status) }
        return touchstones
    }

    fun getResponsibility(context: ActionContext, repo: ModellingGroupRepository): ResponsibilityAndTouchstone
    {
        val path = ResponsibilityPath(context)
        val data = repo.getResponsibility(path.groupId, path.touchstoneId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneId, data.touchstone.status)
        return data
    }

    fun getCoverageSets(context: ActionContext, repo: ModellingGroupRepository): ScenarioTouchstoneAndCoverageSets
    {
        val path = ResponsibilityPath(context)
        val data = repo.getCoverageSets(path.groupId, path.touchstoneId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneId, data.touchstone.status)
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
