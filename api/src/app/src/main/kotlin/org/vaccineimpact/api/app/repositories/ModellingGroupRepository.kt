package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.models.ModellingGroup
import org.vaccineimpact.api.app.models.Responsibilities
import java.io.Closeable

interface ModellingGroupRepository : Repository
{
    fun getModellingGroups(): Iterable<ModellingGroup>
    fun getModellingGroup(id: String): ModellingGroup

    fun getResponsibilities(groupId: String, touchstoneId: String,
                            scenarioFilterParameters: ScenarioFilterParameters): Responsibilities
}