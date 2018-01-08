package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.csvData
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.app.security.checkEstimatePermissionsForTouchstone
import org.vaccineimpact.api.app.security.isAllowedToSeeTouchstone
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.helpers.OneTimeAction
<<<<<<< HEAD
import org.vaccineimpact.api.models.permissions.ReifiedPermission
=======
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.serialization.StreamSerializable
>>>>>>> master
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
    val touchstonesURL = "/:group-id/responsibilities"
    val responsibilitiesURL = "/:group-id/responsibilities/:touchstone-id"
    val scenarioURL = "$responsibilitiesURL/:scenario-id"
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
