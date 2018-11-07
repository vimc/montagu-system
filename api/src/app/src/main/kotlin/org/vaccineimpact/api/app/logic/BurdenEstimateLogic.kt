package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.validate
import org.vaccineimpact.api.app.validateStochastic
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
        val group = modellingGroupRepository.getModellingGroup(groupId)
        val responsibilityInfo = burdenEstimateRepository.getResponsibilityInfo(group.id, touchstoneVersionId, scenarioId)
        val set = burdenEstimateRepository.getBurdenEstimateSetForResponsibility(setId, responsibilityInfo.id)

        val expectedRows = expectationsRepository.getExpectationsForResponsibility(responsibilityInfo.id)
                .expectation.expectedRowHashMap()

        val validatedEstimates = if (set.isStochastic())
        {
            estimates.validateStochastic()
        }
        else
        {
            estimates.validate(expectedRows)
        }

        val type = set.type.type

        if (set.status == BurdenEstimateSetStatus.COMPLETE)
        {
            throw InvalidOperationError("This burden estimate set has been marked as complete." +
                    " You must create a new set if you want to upload any new estimates.")
        }

        burdenEstimateRepository.getEstimateWriter(set).addEstimatesToSet(setId, validatedEstimates, responsibilityInfo.disease)

        if (!set.isStochastic())
        {
            val missingRows = expectedRows.filter(::missingRows)

            if (missingRows.any())
            {
                throw BadRequest("Missing rows:\n${missingRows.map(::serialiseRows).joinToString(",\n")}")
            }
        }

        burdenEstimateRepository.changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.PARTIAL)
        burdenEstimateRepository.updateCurrentBurdenEstimateSet(responsibilityInfo.id, setId, type)
    }

    private fun missingRows(countryMapEntry: Map.Entry<String, HashMap<Int, HashMap<Int, Boolean>>>): Boolean
    {
        return countryMapEntry.value.any { a ->
            a.value.any { y -> !y.value }
        }
    }

    private fun serialiseRows(countryMapEntry: Map.Entry<String, HashMap<Int, HashMap<Int, Boolean>>>): String
    {
        return "${countryMapEntry.key} : ${countryMapEntry.value.map { a ->
            "age ${a.key} : ${a.value.map { it.key.toString() }}"
        }}"
    }
}