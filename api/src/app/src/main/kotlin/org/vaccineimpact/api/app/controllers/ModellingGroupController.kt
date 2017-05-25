package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.*

class ModellingGroupController(private val db: () -> ModellingGroupRepository)
    : AbstractController()
{
    override val urlComponent = "/modelling-groups"
    private val groupScope = "modelling-group:<group-id>"
    val responsibilityPermissions = setOf(
            "*/scenarios.read",
            "$groupScope/responsibilities.read",
            "$groupScope/responsibilities.read"
    )
    val coveragePermissions = responsibilityPermissions + "$groupScope/coverage.read"

    override val endpoints = listOf(
            SecuredEndpoint("/",
                    this::getModellingGroups, setOf("*/modelling-groups.read")),
            SecuredEndpoint("/:group-id/responsibilities/:touchstone-id/",
                    this::getResponsibilities, responsibilityPermissions),
            SecuredEndpoint("/:group-id/responsibilities/:touchstone-id/:scenario-id/",
                    this::getResponsibility, responsibilityPermissions),
            SecuredEndpoint("/:group-id/responsibilities/:touchstone-id/:scenario-id/coverage_sets/",
                    this::getCoverageSets, coveragePermissions),
            SecuredEndpoint("/:group-id/responsibilities/:touchstone-id/:scenario-id/coverage/",
                    this::getCoverageDataAndMetadata, coveragePermissions, contentType = "application/json"),
            SecuredEndpoint("/:group-id/responsibilities/:touchstone-id/:scenario-id/coverage/",
                    this::getCoverageData, coveragePermissions, contentType = "text/csv")
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

    fun getCoverageData(context: ActionContext) = getCoverageDataAndMetadata(context).tableData

    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun getCoverageDataAndMetadata(context: ActionContext): SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val path = ResponsibilityPath(context)
        val data = db().use { it.getCoverageData(path.groupId, path.touchstoneId, path.scenarioId) }
        checkTouchstoneStatus(data.structuredMetadata.touchstone.status, path.touchstoneId, context)
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
