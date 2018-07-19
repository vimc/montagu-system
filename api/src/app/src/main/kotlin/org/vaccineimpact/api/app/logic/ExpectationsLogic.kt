package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.Expectations
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
}

class RepositoriesExpectationsLogic(private val responsibilitiesRepo: ResponsibilitiesRepository,
                                    private val expectationsRepo: ExpectationsRepository,
                                    private val modellingGroupRepo: ModellingGroupRepository,
                                    private val touchstoneRepo: TouchstoneRepository) : ExpectationsLogic
{
    override fun getExpectationsForResponsibility(groupId: String, touchstoneVersionId: String, scenarioId: String): Expectations
    {
        val group = modellingGroupRepo.getModellingGroup(groupId) // resolves correct group ID
        touchstoneRepo.touchstoneVersions.get(touchstoneVersionId) // throws if touchstone version does not exist
        val responsibilityId = responsibilitiesRepo.getResponsibilityId(group.id, touchstoneVersionId, scenarioId)
        return expectationsRepo.getExpectationsForResponsibility(responsibilityId)
    }

    override fun getResponsibilityWithExpectations(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityDetails
    {
        val data = responsibilitiesRepo.getResponsibility(groupId, touchstoneVersionId, scenarioId)
        val expectations = getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
        return ResponsibilityDetails(data.responsibility, data.touchstoneVersion, expectations)
    }

    override fun getResponsibilitySetsWithExpectations(touchstoneVersionId: String): List<ResponsibilitySetWithExpectations>
    {
        val responsibilitySets = responsibilitiesRepo.getResponsibilitiesForTouchstone(touchstoneVersionId)
        return responsibilitySets.map {
            val expectations = expectationsRepo.getExpectationsForResponsibilitySet(it.modellingGroupId, touchstoneVersionId)
            ResponsibilitySetWithExpectations(it, touchstoneVersionId, expectations)
        }
    }
}