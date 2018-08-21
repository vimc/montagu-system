package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.models.LongCoverageRow
import org.vaccineimpact.api.models.Scenario
import org.vaccineimpact.api.models.ScenarioAndCoverageSets
import org.vaccineimpact.api.serialization.SplitData

interface ScenarioLogic
{
    fun getScenarios(touchstoneVersionId: String, filterParams: ScenarioFilterParameters): List<Scenario>

    fun getScenario(touchstoneVersionId: String, scenarioDescId: String): Scenario
    fun getScenarioAndCoverageSets(touchstoneVersionId: String, scenarioDescId: String): ScenarioAndCoverageSets

    fun getScenarioAndCoverageData(touchstoneVersionId: String, scenarioDescId: String): SplitData<ScenarioAndCoverageSets, LongCoverageRow>

}

class RepositoriesScenarioLogic(private val scenarioRepository: ScenarioRepository) : ScenarioLogic
{

    override fun getScenarios(touchstoneVersionId: String, filterParams: ScenarioFilterParameters): List<Scenario>
    {
        return scenarioRepository.getScenariosForTouchstone(touchstoneVersionId, filterParams)
    }

    override fun getScenario(touchstoneVersionId: String, scenarioDescId: String): Scenario
    {
        return scenarioRepository.getScenarioForTouchstone(touchstoneVersionId, scenarioDescId)
    }

    override fun getScenarioAndCoverageSets(touchstoneVersionId: String, scenarioDescId: String): ScenarioAndCoverageSets
    {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getScenarioAndCoverageData(touchstoneVersionId: String, scenarioDescId: String): SplitData<ScenarioAndCoverageSets, LongCoverageRow>
    {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

}