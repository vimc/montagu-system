package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.Expectations
import org.vaccineimpact.api.models.responsibilities.ResponsibilityDetails

interface ExpectationsLogic
{
    fun getExpectationsById(expectationId: Int, groupId: String, touchstoneVersionId: String): Expectations

    fun getResponsibilityWithExpectations(groupId: String,
                                          touchstoneVersionId: String,
                                          scenarioId: String): ResponsibilityDetails
}

class RepositoriesExpectationsLogic(private val responsibilitiesRepository: ResponsibilitiesRepository,
                                    private val expectationsRepository: ExpectationsRepository,
                                    private val modellingGroupRepository: ModellingGroupRepository,
                                    private val touchstoneRepository: TouchstoneRepository) : ExpectationsLogic
{
    override fun getExpectationsById(expectationId: Int, groupId: String, touchstoneVersionId: String):
            Expectations
    {
        checkGroupAndTouchstoneExist(groupId, touchstoneVersionId)
        val expectationIds = expectationsRepository.getExpectationIdsForGroupAndTouchstone(groupId, touchstoneVersionId)

        if (!expectationIds.contains(expectationId)){
            throw UnknownObjectError(expectationId, "burden-estimate-expectation")
        }

        return expectationsRepository.getExpectationsById(expectationId)
    }

    override fun getResponsibilityWithExpectations(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityDetails
    {
        checkGroupAndTouchstoneExist(groupId, touchstoneVersionId)
        val data = responsibilitiesRepository.getResponsibility(groupId, touchstoneVersionId, scenarioId)
        val expectations = expectationsRepository.getExpectationsForResponsibility(data.responsibilityId)
        return ResponsibilityDetails(data.responsibility, data.touchstoneVersion, expectations)
    }

    private fun checkGroupAndTouchstoneExist(groupId: String, touchstoneVersionId: String)
    {
        modellingGroupRepository.getModellingGroup(groupId) // throws if group does not exist
        touchstoneRepository.touchstoneVersions.get(touchstoneVersionId) // throws if touchstone version does not exist
    }
}