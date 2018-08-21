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

    fun getModellingGroupsForDisease(diseaseId: String): List<ModellingGroup>

    fun getModellingGroupsForScenario(scenarioDescriptionId: String): List<ModellingGroup>

    fun getTouchstonesByGroupId(groupId: String): List<Touchstone>

    fun createModellingGroup(newGroup: ModellingGroupCreation)
}