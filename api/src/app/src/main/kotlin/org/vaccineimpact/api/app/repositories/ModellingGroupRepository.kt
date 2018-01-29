package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.SplitData

interface ModellingGroupRepository : Repository
{
    fun getModellingGroups(): Iterable<ModellingGroup>
    fun getModellingGroup(id: String): ModellingGroup
    fun getModellingGroupDetails(groupId: String): ModellingGroupDetails

    fun getResponsibilities(groupId: String, touchstoneId: String,
                            scenarioFilterParameters: ScenarioFilterParameters): ResponsibilitiesAndTouchstoneStatus

    fun getResponsibility(groupId: String, touchstoneId: String, scenarioId: String): ResponsibilityAndTouchstone

    fun getTouchstonesByGroupId(groupId: String): List<Touchstone>

    fun getCoverageSets(groupId: String, touchstoneId: String, scenarioId: String): ScenarioTouchstoneAndCoverageSets
    fun getCoverageData(groupId: String, touchstoneId: String, scenarioId: String): SplitData<ScenarioTouchstoneAndCoverageSets, LongCoverageRow>
}