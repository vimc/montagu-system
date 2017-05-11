package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.*

class TouchstoneController(private val db: () -> TouchstoneRepository) : AbstractController()
{
    override val urlComponent: String = "/touchstones"
    override val endpoints = listOf(
            SecuredEndpoint("/", this::getTouchstones, listOf("*/touchstones.read")),
            SecuredEndpoint("/:touchstone-id/scenarios", this::getScenarios, listOf("*/touchstones.read", "*/scenarios.read", "*/coverage.read"))
    )

    fun getTouchstones(context: ActionContext): List<Touchstone>
    {
        var touchstones = db().use { it.touchstones.all() }
        if (!context.hasPermission(ReifiedPermission("touchstones.prepare", Scope.Global())))
        {
            touchstones = touchstones.filter { it.status != TouchstoneStatus.IN_PREPARATION }
        }
        return touchstones.toList()
    }

    fun getScenarios(context: ActionContext): List<ScenarioAndCoverageSets>
    {
        val touchstoneId = touchstoneId(context)
        val filterParameters = ScenarioFilterParameters.fromContext(context)
        return db().use { it.scenarios(touchstoneId, filterParameters) }
    }

    private fun touchstoneId(context: ActionContext): String = context.params(":touchstone-id")
}