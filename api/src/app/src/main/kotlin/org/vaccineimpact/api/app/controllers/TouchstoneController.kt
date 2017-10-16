package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.StreamedResponse
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission

class TouchstoneController(context: ControllerContext) : AbstractController(context)
{
    private val permissions = setOf("*/touchstones.read")
    private val scenarioPermissions = permissions + setOf("*/scenarios.read", "*/coverage.read")
    private val demographicPermissions = permissions + setOf("*/demographics.read")

    override val urlComponent: String = "/touchstones"
    override fun endpoints(repos: RepositoryFactory): Iterable<EndpointDefinition<*>>
    {
        val repo: (Repositories) -> TouchstoneRepository = { it.touchstone }
        return listOf(
                oneRepoEndpoint("/", this::getTouchstones, repos, repo).secured(permissions),
                oneRepoEndpoint("/:touchstone-id/scenarios/", this::getScenarios, repos, repo).secured(scenarioPermissions),
                oneRepoEndpoint("/:touchstone-id/scenarios/:scenario-id/", this::getScenario, repos, repo).secured(scenarioPermissions),
                oneRepoEndpoint("/:touchstone-id/demographics/", this::getDemographicDatasets, repos, repo).secured(demographicPermissions),
                oneRepoEndpoint("/:touchstone-id/demographics/:source-code/:type-code/", this::getDemographicDataAndMetadata, repos, repo, contentType = "application/json").secured(demographicPermissions),
                oneRepoEndpoint("/:touchstone-id/demographics/:source-code/:type-code/", this::getDemographicData, repos, repo, contentType = "text/csv").secured(demographicPermissions),
                oneRepoEndpoint("/:touchstone-id/demographics/:source-code/:type-code/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.DEMOGRAPHY) }, repos, { it.token }).secured(demographicPermissions)

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


    fun getDemographicDatasets(context: ActionContext, repo: TouchstoneRepository): List<DemographicDataset>
    {
        val touchstone = touchstone(context, repo)
        return repo.getDemographicDatasets(touchstone.id)
    }

    private fun getDemographicDataAndMetadata(context: ActionContext, repo: TouchstoneRepository):
            SplitData<DemographicDataForTouchstone, DemographicRow>
    {
        val touchstone = touchstone(context, repo)
        val source = context.params(":source-code")
        val type = context.params(":type-code")
        val gender = context.queryParams("gender")
        return repo.getDemographicData(type, source, touchstone.id, gender?: "both")
    }

    fun getDemographicDataAndMetadataAsStream(context: ActionContext, repo: TouchstoneRepository): StreamedResponse
    {
        return context.streamedResponse { stream ->
            getDemographicDataAndMetadata(context, repo).serialize(stream, Serializer.instance)
        }
    }

    fun getDemographicData(context: ActionContext, repo: TouchstoneRepository): StreamedResponse
    {
        val data = getDemographicDataAndMetadata(context, repo)
        val metadata = data.structuredMetadata
        val source = context.params(":source-code")
        val gender = context.queryParams("gender")?: "both"
        val filename = "${metadata.touchstone.id}_${source}_${metadata.demographicData.id}_$gender.csv"
        context.addAttachmentHeader(filename)

        return context.streamedResponse { stream ->
            data.tableData.serialize(stream, Serializer.instance)
        }
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