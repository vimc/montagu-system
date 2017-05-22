package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.SplitData
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.models.*

interface ModellingGroupRepository : Repository
{
    fun getModellingGroups(): Iterable<ModellingGroup>
    fun getModellingGroup(id: String): ModellingGroup

    fun getResponsibilities(groupId: String, touchstoneId: String,
                            scenarioFilterParameters: ScenarioFilterParameters): ResponsibilitiesAndTouchstoneStatus
    fun getResponsibility(groupId: String, touchstoneId: String, scenarioId: String): ResponsibilityAndTouchstone
    fun getCoverageSets(groupId: String, touchstoneId: String, scenarioId: String): ScenarioTouchstoneAndCoverageSets
    fun getCoverageData(groupId: String, touchstoneId: String, scenarioId: String): SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
}