package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.Expectations

interface ExpectationsLogic
{
    fun getExpectations(groupId: String,
                        touchstoneVersionId: String,
                        expectationId: Int): Expectations
}

class RepositoriesExpectationsLogic(private val expectationsRepository: ExpectationsRepository,
                                    private val modellingGroupRepository: ModellingGroupRepository,
                                    private val touchstoneRepository: TouchstoneRepository) : ExpectationsLogic
{
    override fun getExpectations(groupId: String, touchstoneVersionId: String, expectationId: Int):
            Expectations
    {
        modellingGroupRepository.getModellingGroup(groupId) // throws if group does not exist
        touchstoneRepository.touchstoneVersions.get(touchstoneVersionId) // throws if touchstone version does not exist
        return expectationsRepository.getExpectations(expectationId)
    }

}