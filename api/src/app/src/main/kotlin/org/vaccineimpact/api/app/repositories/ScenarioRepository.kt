package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.Scenario

interface ScenarioRepository : Repository
{
    fun getScenarios(ids: Iterable<String>): List<Scenario>
}