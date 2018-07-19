package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.Expectations
import org.vaccineimpact.api.models.ModellingGroup
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.responsibilities.ResponsibilityDetails
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithExpectations

interface ExpectationsLogic
{
    fun getExpectationsForResponsibility(groupId: String,
                                         touchstoneVersionId: String,
                                         scenarioId: String): Expectations

    fun getResponsibilityWithExpectations(groupId: String,
                                          touchstoneVersionId: String,
                                          scenarioId: String): ResponsibilityDetails

    fun getResponsibilitySetsWithExpectations(touchstoneVersionId: String): List<ResponsibilitySetWithExpectations>

    fun getResponsibilitySetWithExpectations(
            groupId: String,
            touchstoneVersionId: String,
            filterParameters: ScenarioFilterParameters
    ): Pair<ResponsibilitySetWithExpectations, TouchstoneStatus>
}

class RepositoriesExpectationsLogic(private val responsibilitiesRepo: ResponsibilitiesRepository,
                                    private val expectationsRepo: ExpectationsRepository,
                                    private val modellingGroupRepo: ModellingGroupRepository,
                                    private val touchstoneRepo: TouchstoneRepository) : ExpectationsLogic
{
    override fun getExpectationsForResponsibility(groupId: String, touchstoneVersionId: String, scenarioId: String): Expectations
    {
        val group = checkGroupAndTouchstoneExist(groupId, touchstoneVersionId)
        val responsibilityId = responsibilitiesRepo.getResponsibilityId(group.id, touchstoneVersionId, scenarioId)
        return expectationsRepo.getExpectationsForResponsibility(responsibilityId)
    }

    override fun getResponsibilityWithExpectations(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityDetails
    {
        val group = checkGroupAndTouchstoneExist(groupId, touchstoneVersionId)
        val responsibility = responsibilitiesRepo.getResponsibility(group.id, touchstoneVersionId, scenarioId)
        val expectations = expectationsRepo.getExpectationsForResponsibility(responsibility.responsibilityId)
        return ResponsibilityDetails(responsibility.responsibility, responsibility.touchstoneVersion, expectations)
    }

    override fun getResponsibilitySetsWithExpectations(touchstoneVersionId: String): List<ResponsibilitySetWithExpectations>
    {
        val responsibilitySets = responsibilitiesRepo.getResponsibilitiesForTouchstone(touchstoneVersionId)
        return responsibilitySets.map {
            val expectations = expectationsRepo.getExpectationsForResponsibilitySet(it.modellingGroupId, touchstoneVersionId)
            ResponsibilitySetWithExpectations(it, expectations)
        }
    }

    override fun getResponsibilitySetWithExpectations(
            groupId: String,
            touchstoneVersionId: String,
            filterParameters: ScenarioFilterParameters
    ): Pair<ResponsibilitySetWithExpectations, TouchstoneStatus>
    {
        val group = checkGroupAndTouchstoneExist(groupId, touchstoneVersionId)
        val data = responsibilitiesRepo.getResponsibilitiesForGroupAndTouchstone(
                group.id, touchstoneVersionId, filterParameters)
        val expectations = expectationsRepo.getExpectationsForResponsibilitySet(group.id, touchstoneVersionId)
        return Pair(
                ResponsibilitySetWithExpectations(data.responsibilitySet, expectations),
                data.touchstoneStatus
        )
    }

    private fun checkGroupAndTouchstoneExist(groupId: String, touchstoneVersionId: String): ModellingGroup
    {
        touchstoneRepo.touchstoneVersions.get(touchstoneVersionId) // throws if touchstone version does not exist
        return modellingGroupRepo.getModellingGroup(groupId) // throws if group does not exist and resolves canonical ID
    }
}