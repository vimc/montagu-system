package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.AssociateUser
import org.vaccineimpact.api.models.ModellingGroup
import org.vaccineimpact.api.models.ModellingGroupDetails
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.PermissionSet


open class ModellingGroupController(
        context: ActionContext,
        private val modellingGroupRepository: ModellingGroupRepository,
        private val userRepo: UserRepository
) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.modellingGroup, repositories.user)

    fun getModellingGroups(): List<ModellingGroup>
    {
        return modellingGroupRepository.getModellingGroups().toList()
    }

    fun getModellingGroup(): ModellingGroupDetails
    {
        val groupId = groupId(context)
        return modellingGroupRepository.getModellingGroupDetails(groupId)
    }

    fun modifyMembership(): String
    {
        val associateUser = context.postData<AssociateUser>()

        val groupId = context.params(":group-id")
        val scope = Scope.parse("modelling-group:$groupId")

        val managingScopes = managingScopes(context)
        if (!managingScopes.any({ it.encompasses(scope) }))
        {
            throw MissingRequiredPermissionError(PermissionSet("$scope/modelling-groups.manage-members"))
        }

        userRepo.modifyMembership(groupId, associateUser)

        return okayResponse()
    }

    private fun managingScopes(context: ActionContext) = context.permissions
            .filter { it.name == "modelling-groups.manage-members" }
            .map { it.scope }

    // We are sure that this will be non-null, as its part of the URL,
    // and Spark wouldn't have mapped us here if it were blank
    private fun groupId(context: ActionContext): String = context.params(":group-id")
}
