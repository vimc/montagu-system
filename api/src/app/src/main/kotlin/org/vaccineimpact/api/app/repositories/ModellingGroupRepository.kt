package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.SplitData

interface ModellingGroupRepository : Repository
{
    fun getModellingGroups(): Iterable<ModellingGroup>
    @Throws(UnknownObjectError::class)
    fun getModellingGroup(id: String): ModellingGroup
    fun getModellingGroupDetails(groupId: String): ModellingGroupDetails

    fun getModellingGroupsForScenario(scenarioDescriptionId: String, touchstoneVersionId: String): List<ModellingGroup>

    fun getTouchstonesByGroupId(groupId: String): List<Touchstone>

    fun createModellingGroup(newGroup: ModellingGroupCreation)

    fun getDiseasesForModellingGroup(id: String): List<String>
}