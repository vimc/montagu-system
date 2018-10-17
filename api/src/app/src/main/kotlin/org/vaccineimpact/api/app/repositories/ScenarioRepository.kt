package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.models.Scenario

interface ScenarioRepository : Repository
{
    /** Throws an UnknownObjectError if it doesn't exist **/
    fun checkScenarioDescriptionExists(id: String): Unit

    fun getScenarios(descriptionIds: Iterable<String>): List<Scenario>

    fun getScenariosForTouchstone(touchstoneVersionId: String, scenarioFilterParameters: ScenarioFilterParameters):
            List<Scenario>

    fun getScenarioForTouchstone(touchstoneVersionId: String, scenarioDescriptionId: String): Scenario

    fun getScenarioForResponsibility(touchstoneVersionId: String,
                                     scenarioDescriptionId: String,
                                     responsibilityId: Int): Scenario
}