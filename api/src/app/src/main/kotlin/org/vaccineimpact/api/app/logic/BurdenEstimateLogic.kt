package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.checkAllValuesAreEqual
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.models.BurdenEstimateSetStatus
import org.vaccineimpact.api.models.BurdenEstimateWithRunId

interface BurdenEstimateLogic
{
    fun populateBurdenEstimateSet(setId: Int, groupId: String, touchstoneVersionId: String, scenarioId: String,
                                  estimates: Sequence<BurdenEstimateWithRunId>)
}

class RepositoriesBurdenEstimateLogic(private val modellingGroupRepository: ModellingGroupRepository,
                                      private val burdenEstimateRepository: BurdenEstimateRepository,
                                      private val expectationsRepository: ExpectationsRepository) : BurdenEstimateLogic
{

    override fun populateBurdenEstimateSet(setId: Int, groupId: String, touchstoneVersionId: String, scenarioId: String,
                                           estimates: Sequence<BurdenEstimateWithRunId>)
    {
        val validatedEstimates = estimates.checkAllValuesAreEqual({ it.disease },
                InconsistentDataError("More than one value was present in the disease column")
        )
        val group = modellingGroupRepository.getModellingGroup(groupId)
        val responsibilityInfo = burdenEstimateRepository.getResponsibilityInfo(group.id, touchstoneVersionId, scenarioId)
        val set = burdenEstimateRepository.getBurdenEstimateSetForResponsibility(setId, responsibilityInfo.id)

        val type = set.type.type

        if (set.status == BurdenEstimateSetStatus.COMPLETE)
        {
            throw InvalidOperationError("This burden estimate set has been marked as complete." +
                    " You must create a new set if you want to upload any new estimates.")
        }

        val expectations = expectationsRepository.getExpectationsForResponsibility(responsibilityInfo.id)
                .expectation

        val expectedRows = if (set.isStochastic())
        {
            expectations.expectedStochasticRows(responsibilityInfo.disease)
        }
        else
        {
            expectations.expectedCentralRows(responsibilityInfo.disease)
        }

        burdenEstimateRepository.getEstimateWriter(set).addEstimatesToSet(setId, validatedEstimates, responsibilityInfo.disease)
        burdenEstimateRepository.changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.PARTIAL)
        burdenEstimateRepository.updateCurrentBurdenEstimateSet(responsibilityInfo.id, setId, type)
    }

}