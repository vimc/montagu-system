package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.models.ModellingGroup
import org.vaccineimpact.api.models.ResponsibilitiesAndTouchstoneStatus
import org.vaccineimpact.api.models.ScenarioTouchstoneAndCoverageSets

interface ModellingGroupRepository : Repository
{
    fun getModellingGroups(): Iterable<ModellingGroup>
    fun getModellingGroup(id: String): ModellingGroup

    fun getResponsibilities(groupId: String, touchstoneId: String,
                            scenarioFilterParameters: ScenarioFilterParameters): ResponsibilitiesAndTouchstoneStatus
    fun getCoverageSets(groupId: String, touchstoneId: String, scenarioId: String): ScenarioTouchstoneAndCoverageSets
}