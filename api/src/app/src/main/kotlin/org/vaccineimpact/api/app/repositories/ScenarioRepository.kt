package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.models.Scenario

interface ScenarioRepository : Repository
{
    @Throws(UnknownObjectError::class)
    fun checkScenarioDescriptionExists(id: String): Unit

    fun getScenarios(descriptionIds: Iterable<String>): List<Scenario>

    fun getScenariosForTouchstone(touchstoneVersionId: String, scenarioFilterParameters: ScenarioFilterParameters):
            List<Scenario>

    fun getScenarioForTouchstone(touchstoneVersionId: String, scenarioDescriptionId: String): Scenario

}