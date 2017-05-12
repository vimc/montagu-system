package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.Scenario

interface ScenarioRepository : Repository
{
    fun getScenarios(descriptionIds: Iterable<String>): List<Scenario>
}