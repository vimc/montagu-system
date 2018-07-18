package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.Expectations

interface ExpectationsLogic
{
    fun getExpectationsForResponsibility(groupId: String,
                                         touchstoneVersionId: String,
                                         scenarioId: String): Expectations
}

class RepositoriesExpectationsLogic(private val responsibilitiesRepository: ResponsibilitiesRepository,
                                    private val expectationsRepository: ExpectationsRepository,
                                    private val modellingGroupRepository: ModellingGroupRepository,
                                    private val touchstoneRepository: TouchstoneRepository) : ExpectationsLogic
{
    override fun getExpectationsForResponsibility(groupId: String, touchstoneVersionId: String, scenarioId: String): Expectations
    {
        modellingGroupRepository.getModellingGroup(groupId) // throws if group does not exist
        touchstoneRepository.touchstoneVersions.get(touchstoneVersionId) // throws if touchstone version does not exist
        val responsibilityId = responsibilitiesRepository.getResponsibilityId(groupId, touchstoneVersionId, scenarioId)
        return expectationsRepository.getExpectationsForResponsibility(responsibilityId)
    }

}