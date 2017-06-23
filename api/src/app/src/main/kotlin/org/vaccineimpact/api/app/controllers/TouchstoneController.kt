package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission

class TouchstoneController(context: ControllerContext) : AbstractController(context)
{
    private val permissions = setOf("*/touchstones.read")
    private val scenarioPermissions = permissions + setOf("*/scenarios.read", "*/coverage.read")

    override val urlComponent: String = "/touchstones"
    override val endpoints = listOf(
            SecuredEndpoint("/",                                       this::getTouchstones, permissions),
            SecuredEndpoint("/:touchstone-id/scenarios/",              this::getScenarios, scenarioPermissions),
            SecuredEndpoint("/:touchstone-id/scenarios/:scenario-id/", this::getScenario, scenarioPermissions)
    )

    private val touchstonePreparer = ReifiedPermission("touchstones.prepare", Scope.Global())
    private fun db() = repos.touchstone()

    fun getTouchstones(context: ActionContext): List<Touchstone>
    {
        var touchstones = db().use { it.touchstones.all() }
        if (!context.hasPermission(touchstonePreparer))
        {
            touchstones = touchstones.filter { it.status != TouchstoneStatus.IN_PREPARATION }
        }
        return touchstones.toList()
    }

    fun getScenarios(context: ActionContext): List<ScenarioAndCoverageSets>
    {
        db().use {
            val touchstone = touchstone(context, it)
            val filterParameters = ScenarioFilterParameters.fromContext(context)
            return it.scenarios(touchstone.id, filterParameters)
        }
    }

    fun getScenario(context: ActionContext): ScenarioTouchstoneAndCoverageSets
    {
        db().use {
            val touchstone = touchstone(context, it)
            val scenarioId: String = context.params(":scenario-id")
            val data = it.getScenario(touchstone.id, scenarioId)
            return ScenarioTouchstoneAndCoverageSets(touchstone, data.scenario, data.coverageSets)
        }
    }

    private fun touchstone(context: ActionContext, db: TouchstoneRepository): Touchstone
    {
        val id = context.params(":touchstone-id")
        val touchstone = db.touchstones.get(id)
        if (touchstone.status == TouchstoneStatus.IN_PREPARATION)
        {
            context.requirePermission(touchstonePreparer)
        }
        return touchstone
    }


}