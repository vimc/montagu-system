package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.models.ModellingGroup
import org.vaccineimpact.api.models.ModellingGroupCreation
import org.vaccineimpact.api.models.ModellingGroupDetails
import org.vaccineimpact.api.models.Touchstone

interface ModellingGroupRepository : Repository
{
    fun getModellingGroups(): Iterable<ModellingGroup>
    fun getModellingGroups(ids: Array<String>): Iterable<ModellingGroup>
    @Throws(UnknownObjectError::class)
    fun getModellingGroup(id: String): ModellingGroup
    fun getModellingGroupDetails(groupId: String): ModellingGroupDetails

    fun getModellingGroupsForScenario(scenarioDescriptionId: String, touchstoneVersionId: String): List<ModellingGroup>

    fun getTouchstonesByGroupId(groupId: String): List<Touchstone>

    fun createModellingGroup(newGroup: ModellingGroupCreation)

    fun getDiseasesForModellingGroup(groupId: String): List<String>

    fun getLatestModelVersionForGroup(groupId: String, disease: String): Int
}