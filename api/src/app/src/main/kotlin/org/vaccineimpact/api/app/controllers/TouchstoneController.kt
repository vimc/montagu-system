package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission

class TouchstoneController(context: ControllerContext) : AbstractController(context)
{
    private val permissions = setOf("*/touchstones.read")
    private val scenarioPermissions = permissions + setOf("*/scenarios.read", "*/coverage.read")
    private val demographicPermissions = permissions + setOf("*/demographics.read")

    override val urlComponent: String = "/touchstones"
    override fun endpoints(repos: Repositories): Iterable<EndpointDefinition<*>>
    {
        val repo = repos.touchstone
        return listOf(
                oneRepoEndpoint("/", this::getTouchstones, repo).secured(permissions),
                oneRepoEndpoint("/:touchstone-id/scenarios/", this::getScenarios, repo).secured(scenarioPermissions),
                oneRepoEndpoint("/:touchstone-id/scenarios/:scenario-id/", this::getScenario, repo).secured(scenarioPermissions),
                oneRepoEndpoint("/:touchstone-id/demographics/", this::getDemographicTypes, repo).secured(demographicPermissions)

        )
    }

    private val touchstonePreparer = ReifiedPermission("touchstones.prepare", Scope.Global())

    fun getTouchstones(context: ActionContext, repo: TouchstoneRepository): List<Touchstone>
    {
        var touchstones = repo.touchstones.all()
        if (!context.hasPermission(touchstonePreparer))
        {
            touchstones = touchstones.filter { it.status != TouchstoneStatus.IN_PREPARATION }
        }
        return touchstones.toList()
    }

    fun getScenarios(context: ActionContext, repo: TouchstoneRepository): List<ScenarioAndCoverageSets>
    {
        val touchstone = touchstone(context, repo)
        val filterParameters = ScenarioFilterParameters.fromContext(context)
        return repo.scenarios(touchstone.id, filterParameters)
    }


    fun getDemographicTypes(context: ActionContext, repo: TouchstoneRepository): List<DemographicStatisticType>
    {
        val touchstone = touchstone(context, repo)
        return repo.getDemographicStatisticTypes(touchstone.id)
    }

    fun getScenario(context: ActionContext, repo: TouchstoneRepository): ScenarioTouchstoneAndCoverageSets
    {
        val touchstone = touchstone(context, repo)
        val scenarioId: String = context.params(":scenario-id")
        val data = repo.getScenario(touchstone.id, scenarioId)
        return ScenarioTouchstoneAndCoverageSets(touchstone, data.scenario, data.coverageSets)
    }

    private fun touchstone(context: ActionContext, repo: TouchstoneRepository): Touchstone
    {
        val id = context.params(":touchstone-id")
        val touchstone = repo.touchstones.get(id)
        if (touchstone.status == TouchstoneStatus.IN_PREPARATION)
        {
            context.requirePermission(touchstonePreparer)
        }
        return touchstone
    }


}