package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.Scenario

interface ScenarioRepository : Repository
{
    /** Throws an UnknownObjectError if it doesn't exist **/
    fun checkScenarioDescriptionExists(id: String): Unit

    fun getScenarios(descriptionIds: Iterable<String>): List<Scenario>
}