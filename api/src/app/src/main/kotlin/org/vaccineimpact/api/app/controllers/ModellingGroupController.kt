package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission

open class ModellingGroupController(context: ControllerContext)
    : AbstractController(context)
{
    override val urlComponent = "/modelling-groups"
    private val groupScope = "modelling-group:<group-id>"
    val responsibilityPermissions = setOf(
            "*/scenarios.read",
            "$groupScope/responsibilities.read",
            "$groupScope/responsibilities.read"
    )
    val coveragePermissions = responsibilityPermissions + "$groupScope/coverage.read"
    val responsibilitiesURL = "/:group-id/responsibilities/:touchstone-id"
    val scenarioURL = "$responsibilitiesURL/:scenario-id"
    val coverageURL = "$scenarioURL/coverage"

    override val endpoints = listOf(
            SecuredEndpoint("/", this::getModellingGroups, setOf("*/modelling-groups.read")),
            SecuredEndpoint("/:group-id/", this::getModellingGroup, setOf("*/modelling-groups.read", "*/models.read")),
            SecuredEndpoint("$responsibilitiesURL/", this::getResponsibilities, responsibilityPermissions),
            SecuredEndpoint("$scenarioURL/", this::getResponsibility, responsibilityPermissions),
            SecuredEndpoint("$scenarioURL/coverage_sets/", this::getCoverageSets, coveragePermissions),
            SecuredEndpoint("$coverageURL/", this::getCoverageDataAndMetadata, coveragePermissions, contentType = "application/json"),
            SecuredEndpoint("$coverageURL/", this::getCoverageData, coveragePermissions, contentType = "text/csv"),
            SecuredEndpoint("$coverageURL/get_onetime_link/", { c -> getOneTimeLinkToken(c, OneTimeAction.COVERAGE) }, coveragePermissions)
    )

    fun getModellingGroups(context: ActionContext): List<ModellingGroup>
    {
        return db().use { it.getModellingGroups() }.toList()
    }

    fun getModellingGroup(context: ActionContext): ModellingGroupDetails
    {
        val groupId = groupId(context)
        return db().use { it.getModellingGroupDetails(groupId) }
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

    open fun getCoverageData(context: ActionContext): DataTable<CoverageRow>
    {
        val data = getCoverageDataAndMetadata(context)
        val metadata = data.structuredMetadata
        val filename = "coverage_${metadata.touchstone.id}_${metadata.scenario.id}.csv"
        context.addResponseHeader("Content-Disposition", """attachment; filename="$filename"""")
        return data.tableData
    }

    // TODO: https://vimc.myjetbrains.com/youtrack/issue/VIMC-307
    // Use streams to speed up this process of sending large data
    fun getCoverageDataAndMetadata(context: ActionContext): SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val path = ResponsibilityPath(context)
        val data = db().use { it.getCoverageData(path.groupId, path.touchstoneId, path.scenarioId) }
        checkTouchstoneStatus(data.structuredMetadata.touchstone.status, path.touchstoneId, context)
        return data
    }

    private fun db() = repos.modellingGroup()

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
