package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.models.*

class ModellingGroupController(private val db: () -> ModellingGroupRepository)
    : AbstractController()
{
    override val urlComponent = "/modelling-groups"

    override val endpoints = listOf(
            SecuredEndpoint("/", this::getModellingGroups, listOf("*/modelling-groups.read")),
            SecuredEndpoint("/:group-id/responsibilities/:touchstone-id/", this::getResponsibilities, listOf("*/responsibilities.read", "*/scenarios.read"))
    )

    fun getModellingGroups(context: ActionContext): List<ModellingGroup>
    {
        return db().use { it.getModellingGroups() }.toList()
    }

    fun getResponsibilities(context: ActionContext): Responsibilities
    {
        val groupId = groupId(context)
        val touchstoneId = context.params(":touchstone-id")
        val filterParameters = ScenarioFilterParameters.fromContext(context)

        val data = db().use { it.getResponsibilities(groupId, touchstoneId, filterParameters) }
        if (data.touchstoneStatus == TouchstoneStatus.IN_PREPARATION && !context.hasPermission(ReifiedPermission("touchstones.prepare", Scope.Global())))
        {
            throw UnknownObjectError(touchstoneId, "Touchstone")
        }
        else
        {
            return data.responsibilities
        }
    }

    // We are sure that this will be non-null, as its part of the URL,
    // and Spark wouldn't have mapped us here if it were blank
    private fun groupId(context: ActionContext): String = context.params(":group-id")
}
