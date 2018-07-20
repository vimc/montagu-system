package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.errors.UnknownObjectError
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
    fun getExpectationsById(expectationId: Int, groupId: String, touchstoneVersionId: String): Expectations

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

class RepositoriesExpectationsLogic(private val responsibilitiesRepository: ResponsibilitiesRepository,
                                    private val expectationsRepository: ExpectationsRepository,
                                    private val modellingGroupRepository: ModellingGroupRepository,
                                    private val touchstoneRepository: TouchstoneRepository) : ExpectationsLogic
{
    override fun getExpectationsById(expectationId: Int, groupId: String, touchstoneVersionId: String):
            Expectations
    {
        val group = checkGroupAndTouchstoneExist(groupId, touchstoneVersionId)
        val expectationIds = expectationsRepository.getExpectationIdsForGroupAndTouchstone(group.id, touchstoneVersionId)

        if (!expectationIds.contains(expectationId)){
            throw UnknownObjectError(expectationId, "burden-estimate-expectation")
        }

        return expectationsRepository.getExpectationsById(expectationId)
    }

    override fun getResponsibilityWithExpectations(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityDetails
    {
        val group = checkGroupAndTouchstoneExist(groupId, touchstoneVersionId)
        val responsibility = responsibilitiesRepository.getResponsibility(group.id, touchstoneVersionId, scenarioId)
        val expectations = expectationsRepository.getExpectationsForResponsibility(responsibility.responsibilityId)
        return ResponsibilityDetails(responsibility.responsibility, responsibility.touchstoneVersion, expectations)
    }

    override fun getResponsibilitySetsWithExpectations(touchstoneVersionId: String): List<ResponsibilitySetWithExpectations>
    {
        val responsibilitySets = responsibilitiesRepository.getResponsibilitiesForTouchstone(touchstoneVersionId)
        return responsibilitySets.map {
            val expectations = expectationsRepository.getExpectationsForResponsibilitySet(it.modellingGroupId, touchstoneVersionId)
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
        val data = responsibilitiesRepository.getResponsibilitiesForGroupAndTouchstone(
                group.id, touchstoneVersionId, filterParameters)
        val expectations = expectationsRepository.getExpectationsForResponsibilitySet(group.id, touchstoneVersionId)
        return Pair(
                ResponsibilitySetWithExpectations(data.responsibilitySet, expectations),
                data.touchstoneStatus
        )
    }

    private fun checkGroupAndTouchstoneExist(groupId: String, touchstoneVersionId: String): ModellingGroup
    {
        touchstoneRepository.touchstoneVersions.get(touchstoneVersionId) // throws if touchstone version does not exist
        return modellingGroupRepository.getModellingGroup(groupId) // throws if group does not exist and resolves canonical ID
    }
}