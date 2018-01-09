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
import org.vaccineimpact.api.models.permissions.ReifiedPermission
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
    val touchstonesURL = "/:group-id/responsibilities"
    val responsibilitiesURL = "/:group-id/responsibilities/:touchstone-id"
    val scenarioURL = "$responsibilitiesURL/:scenario-id"

    override fun endpoints(repos: RepositoryFactory): Iterable<EndpointDefinition<*>>
    {
        val repo: (Repositories) -> ModellingGroupRepository = { it.modellingGroup }
        return listOf(
                oneRepoEndpoint("/", this::getModellingGroups, repos, repo).secured(setOf("*/modelling-groups.read")),
                oneRepoEndpoint("/:group-id/", this::getModellingGroup, repos, repo).secured(setOf("*/modelling-groups.read", "*/models.read")),
                oneRepoEndpoint("/:group-id/actions/associate-member/", this::modifyMembership, repos, { it.user }, method = HttpMethod.post).secured()
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
