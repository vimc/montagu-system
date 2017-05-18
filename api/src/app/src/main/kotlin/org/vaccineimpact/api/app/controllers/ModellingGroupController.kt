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
    private val groupScope = "modelling-group:<group-id>"

    override val endpoints = listOf(
            SecuredEndpoint("/", this::getModellingGroups, setOf(
                    "*/modelling-groups.read"
            )),
            SecuredEndpoint("/:group-id/responsibilities/:touchstone-id/", this::getResponsibilities, setOf(
                    "*/scenarios.read",
                    "$groupScope/responsibilities.read",
                    "$groupScope/responsibilities.read"
            )),
            SecuredEndpoint("/:group-id/responsibilities/:touchstone-id/:scenario-id/", this::getResponsibility, setOf(
                    "*/scenarios.read",
                    "$groupScope/responsibilities.read"
            )),
            SecuredEndpoint("/:group-id/responsibilities/:touchstone-id/:scenario-id/coverage_sets/", this::getCoverageSets, setOf(
                    "*/scenarios.read",
                    "$groupScope/responsibilities.read",
                    "$groupScope/coverage.read"
            ))
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
        checkTouchstoneStatus(data.touchstoneStatus, touchstoneId, context)
        return data.responsibilities
    }

    fun getResponsibility(context: ActionContext): ResponsibilityAndTouchstone
    {
        val path = ResponsibilityPath(context)
        val data = db().use { it.getResponsibility(path.groupId, path.touchstoneId, path.scenarioId)}
        checkTouchstoneStatus(data.touchstone.status, path.touchstoneId, context)
        return data
    }

    fun getCoverageSets(context: ActionContext): ScenarioTouchstoneAndCoverageSets
    {
        val path = ResponsibilityPath(context)
        val data = db().use { it.getCoverageSets(path.groupId, path.touchstoneId, path.scenarioId) }
        checkTouchstoneStatus(data.touchstone.status, path.touchstoneId, context)
        return data
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
