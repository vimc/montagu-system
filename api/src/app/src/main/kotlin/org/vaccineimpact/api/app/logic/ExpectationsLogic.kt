package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.ExpectationMapping
import org.vaccineimpact.api.models.ModellingGroup
import org.vaccineimpact.api.models.responsibilities.ResponsibilityDetails
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithExpectations

interface ExpectationsLogic
{
    fun getExpectationsById(expectationId: Int, groupId: String, touchstoneVersionId: String): ExpectationMapping

    fun getResponsibilityWithExpectations(groupId: String,
                                          touchstoneVersionId: String,
                                          scenarioId: String): ResponsibilityDetails

    fun getResponsibilitySetsWithExpectations(touchstoneVersionId: String): List<ResponsibilitySetWithExpectations>

    fun getResponsibilitySetWithExpectations(
            groupId: String,
            touchstoneVersionId: String,
            filterParameters: ScenarioFilterParameters
    ): ResponsibilitySetWithExpectations
}

class RepositoriesExpectationsLogic(private val responsibilitiesRepository: ResponsibilitiesRepository,
                                    private val expectationsRepository: ExpectationsRepository,
                                    private val modellingGroupRepository: ModellingGroupRepository,
                                    private val touchstoneRepository: TouchstoneRepository) : ExpectationsLogic
{
    override fun getExpectationsById(expectationId: Int, groupId: String, touchstoneVersionId: String):
            ExpectationMapping
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
        val data = responsibilitiesRepository.getResponsibility(group.id, touchstoneVersionId, scenarioId)
        val expectations = expectationsRepository.getExpectationsForResponsibility(data.responsibilityId)
        return ResponsibilityDetails(data.responsibility, data.touchstoneVersion, expectations.expectation)
    }

    override fun getResponsibilitySetsWithExpectations(touchstoneVersionId: String): List<ResponsibilitySetWithExpectations>
    {
        checkTouchstoneExists(touchstoneVersionId)
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
    ): ResponsibilitySetWithExpectations
    {
        val group = checkGroupAndTouchstoneExist(groupId, touchstoneVersionId)
        val responsibilitySet = responsibilitiesRepository.getResponsibilitiesForGroup(
                group.id, touchstoneVersionId, filterParameters)
        val expectations = expectationsRepository.getExpectationsForResponsibilitySet(group.id, touchstoneVersionId)
        return ResponsibilitySetWithExpectations(responsibilitySet, expectations)
    }

    private fun checkGroupAndTouchstoneExist(groupId: String, touchstoneVersionId: String): ModellingGroup
    {
        checkTouchstoneExists(touchstoneVersionId) // throws if touchstone version does not exist
        return modellingGroupRepository.getModellingGroup(groupId) // throws if group does not exist and resolves canonical ID
    }

    private fun checkTouchstoneExists(touchstoneVersionId: String)
    {
        touchstoneRepository.touchstoneVersions.get(touchstoneVersionId)
    }
}