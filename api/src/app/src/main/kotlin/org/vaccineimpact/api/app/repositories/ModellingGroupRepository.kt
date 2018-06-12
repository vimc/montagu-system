package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.SplitData

interface ModellingGroupRepository : Repository
{
    fun getModellingGroups(): Iterable<ModellingGroup>
    fun getModellingGroup(id: String): ModellingGroup
    fun getModellingGroupDetails(groupId: String): ModellingGroupDetails

    fun getTouchstonesByGroupId(groupId: String): List<TouchstoneVersion>

    fun getCoverageSets(groupId: String, touchstoneVersionId: String, scenarioId: String): ScenarioTouchstoneAndCoverageSets
    fun getCoverageData(groupId: String, touchstoneVersionId: String, scenarioId: String): SplitData<ScenarioTouchstoneAndCoverageSets, LongCoverageRow>
}