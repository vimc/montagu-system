package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.*

interface ScenarioLogic
{
    fun getScenariosAndCoverageSetsForTouchstone(touchstoneVersionId: String,
                                                 coverageReadingScopes: List<Scope>,
                                                 filterParams: ScenarioFilterParameters)
            : List<ScenarioAndCoverageSets>

    fun getScenarioTouchstoneAndCoverageSets(touchstoneVersion: TouchstoneVersion,
                                             scenarioDescriptionId: String,
                                             coverageReadingScopes: List<Scope>)
            : ScenarioTouchstoneAndCoverageSets
}

class RepositoriesScenarioLogic(private val touchstoneRepo: TouchstoneRepository,
                                private val modellingGroupRepository: ModellingGroupRepository,
                                private val scenarioRepository: ScenarioRepository) : ScenarioLogic
{
    override fun getScenarioTouchstoneAndCoverageSets(touchstoneVersion: TouchstoneVersion, scenarioDescriptionId: String, coverageReadingScopes: List<Scope>)
            : ScenarioTouchstoneAndCoverageSets
    {
        val groups = modellingGroupRepository.getModellingGroupsForScenario(scenarioDescriptionId)

        return if (hasRequiredCoverageReadingScope(groups, coverageReadingScopes))
        {
            // return coverage with scenario
            val data = touchstoneRepo.getScenarioAndCoverageSets(touchstoneVersion.id, scenarioDescriptionId)
            ScenarioTouchstoneAndCoverageSets(touchstoneVersion, data.scenario, data.coverageSets)
        }
        else
        {
            // return just scenario
            ScenarioTouchstoneAndCoverageSets(touchstoneVersion,
                    scenarioRepository.getScenarioForTouchstone(touchstoneVersion.id, scenarioDescriptionId), null)
        }
    }

    override fun getScenariosAndCoverageSetsForTouchstone(touchstoneVersionId: String,
                                                          coverageReadingScopes: List<Scope>,
                                                          filterParams: ScenarioFilterParameters)
            : List<ScenarioAndCoverageSets>
    {
        val disease = filterParams.disease

        val groups = if (disease != null)
        {
            modellingGroupRepository.getModellingGroupsForDisease(disease)

        }
        else
        {
            listOf()
        }

        return if (hasRequiredCoverageReadingScope(groups, coverageReadingScopes))
        {
            // return coverage with scenarios
            touchstoneRepo.getScenariosAndCoverageSets(touchstoneVersionId, filterParams)
        }
        else
        {
            // return just scenarios
            scenarioRepository.getScenariosForTouchstone(touchstoneVersionId, filterParams)
                    .map { ScenarioAndCoverageSets(it, null) }
        }
    }

    private fun hasRequiredCoverageReadingScope(groups: List<ModellingGroup>,
                                                scopes: List<Scope>): Boolean
    {
        val requiredScopes = groups.map {
            Scope.Specific("modelling-group", it.id)
        } + Scope.Global()

        return scopes.intersect(requiredScopes).any()
    }

}