package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.models.BurdenEstimateOutcome
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.app.validate
import org.vaccineimpact.api.app.validateStochastic
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.FlexibleDataTable

interface BurdenEstimateLogic
{
    fun populateBurdenEstimateSet(setId: Int, groupId: String, touchstoneVersionId: String, scenarioId: String,
                                  estimates: Sequence<BurdenEstimateWithRunId>)

    @Throws(MissingRowsError::class)
    fun closeBurdenEstimateSet(setId: Int, groupId: String, touchstoneVersionId: String, scenarioId: String)

    fun getEstimates(setId: Int,
                     groupId: String,
                     touchstoneVersionId: String,
                     scenarioId: String,
                     outcome: String,
                     burdenEstimateGrouping: BurdenEstimateGrouping = BurdenEstimateGrouping.AGE):
            BurdenEstimateDataSeries

    fun getBurdenEstimateData(setId: Int, groupId: String, touchstoneVersionId: String,
                              scenarioId: String) : FlexibleDataTable<BurdenEstimate>
}

class RepositoriesBurdenEstimateLogic(private val modellingGroupRepository: ModellingGroupRepository,
                                      private val burdenEstimateRepository: BurdenEstimateRepository,
                                      private val expectationsRepository: ExpectationsRepository) : BurdenEstimateLogic
{
    override fun getEstimates(setId: Int, groupId: String, touchstoneVersionId: String,
                              scenarioId: String,
                              outcome: String,
                              burdenEstimateGrouping: BurdenEstimateGrouping)
            : BurdenEstimateDataSeries
    {
        val group = modellingGroupRepository.getModellingGroup(groupId)
        val responsibilityInfo = burdenEstimateRepository.getResponsibilityInfo(group.id, touchstoneVersionId, scenarioId)
        val outcomeIds = burdenEstimateRepository.getBurdenOutcomeIds(outcome)
        return burdenEstimateRepository.getEstimates(setId, responsibilityInfo.id, outcomeIds,
                burdenEstimateGrouping)
    }

    override fun getBurdenEstimateData(setId: Int, groupId: String, touchstoneVersionId: String,
                                       scenarioId: String) : FlexibleDataTable<BurdenEstimate>
    {
        val data = burdenEstimateRepository.getBurdenEstimateOutcomesSequence(groupId,
                                                    touchstoneVersionId, scenarioId, setId)

        //first, group the outcome rows by disease, year, age, country code and country name
        val groupedRows = data
                .groupBy{
                    hashSetOf(it.disease, it.year, it.age,
                            it.country, it.countryName)
                }

        //get the expected outcomes for this burden estimate set
        val expectedOutcomes = burdenEstimateRepository.getExpectedOutcomesForBurdenEstimateSet(setId)

        //next, map to BurdenEstimate objects, including extracting the cohort size outcome
        val rows = groupedRows.values
                .map{
                    mapBurdenEstimate(it)
                }

        return FlexibleDataTable.new(rows.asSequence(), expectedOutcomes)

    }

    private val COHORT_SIZE_CODE = "cohort_size"
    private fun mapBurdenEstimate(records: List<BurdenEstimateOutcome>)
            : BurdenEstimate
    {
        // all records in thr parameter group should have same disease, year, age, country code and country name
        // so use value from the first row
        val reference = records.first()

        //We should find cohort size as one of the burden outcomes

        val cohortSize = records.firstOrNull{it.burden_outcome_code == COHORT_SIZE_CODE}?.value
        val burdenOutcomeRows = records.filter{it.burden_outcome_code != COHORT_SIZE_CODE}

        val burdenOutcomeValues =
                burdenOutcomeRows.associateBy({it.burden_outcome_code}, {it.value})

        return BurdenEstimate(
                reference.disease,
                reference.year,
                reference.age,
                reference.country,
                reference.countryName,
                cohortSize ?: 0f,
                burdenOutcomeValues
        )
    }

    override fun closeBurdenEstimateSet(setId: Int, groupId: String, touchstoneVersionId: String, scenarioId: String)
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)

        // Check all the IDs match up
        val responsibilityInfo = burdenEstimateRepository.getResponsibilityInfo(modellingGroup.id, touchstoneVersionId, scenarioId)
        val set = burdenEstimateRepository.getBurdenEstimateSetForResponsibility(setId, responsibilityInfo.id)
        if (burdenEstimateRepository.getEstimateWriter(set).isSetEmpty(setId))
        {
            throw InvalidOperationError("This burden estimate set does not have any burden estimate data. " +
                    "It cannot be marked as complete")
        }
        else
        {
            val expectedRows = expectationsRepository.getExpectationsForResponsibility(responsibilityInfo.id)
                    .expectation.expectedRowHashMap()
            val validatedRowMap = burdenEstimateRepository.validateEstimates(set, expectedRows)
            val missingRows = validatedRowMap.filter(::missingRows)
            if (missingRows.any())
            {
                burdenEstimateRepository.changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.INVALID)
                throw MissingRowsError(rowErrorMessage(missingRows))
            }
            burdenEstimateRepository.changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.COMPLETE)
        }
    }

    private fun missingRows(countryMapEntry: Map.Entry<String, HashMap<Short, HashMap<Short, Boolean>>>): Boolean
    {
        return countryMapEntry.value.any { a ->
            a.value.any { y -> !y.value }
        }
    }

    private fun rowErrorMessage(missingRows: Map<String, HashMap<Short, HashMap<Short, Boolean>>>): String
    {
        val countries = missingRows.keys
        val message = "Missing rows for ${countries.joinToString(", ")}"
        val firstRowAges = missingRows[countries.first()]
        val firstMissingAge = firstRowAges!!.keys.first()
        val exampleRows = "For example:\n${countries.first()}, age $firstMissingAge," +
                " year ${firstRowAges[firstMissingAge]!!.keys.first()}"
        return "$message\n$exampleRows"
    }

    override fun populateBurdenEstimateSet(setId: Int, groupId: String, touchstoneVersionId: String, scenarioId: String,
                                           estimates: Sequence<BurdenEstimateWithRunId>)
    {
        val group = modellingGroupRepository.getModellingGroup(groupId)
        val responsibilityInfo = burdenEstimateRepository.getResponsibilityInfo(group.id, touchstoneVersionId, scenarioId)
        val set = burdenEstimateRepository.getBurdenEstimateSetForResponsibility(setId, responsibilityInfo.id)

        if (set.status == BurdenEstimateSetStatus.COMPLETE)
        {
            throw InvalidOperationError("This burden estimate set has been marked as complete." +
                    " You must create a new set if you want to upload any new estimates.")
        }

        if (set.isStochastic())
        {
            populateStochasticBurdenEstimateSet(set, responsibilityInfo, estimates)
        }
        else
        {
            populateCentralBurdenEstimateSet(set, responsibilityInfo, estimates)
        }

        burdenEstimateRepository.changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.PARTIAL)
        burdenEstimateRepository.updateCurrentBurdenEstimateSet(responsibilityInfo.id, setId, set.type)
    }

    private fun populateCentralBurdenEstimateSet(set: BurdenEstimateSet, responsibilityInfo: ResponsibilityInfo,
                                                 estimates: Sequence<BurdenEstimateWithRunId>)
    {
        val expectedRows = expectationsRepository.getExpectationsForResponsibility(responsibilityInfo.id)
                .expectation.expectedRowHashMap()


        val validatedEstimates = estimates.validate(expectedRows)

        burdenEstimateRepository.getEstimateWriter(set).addEstimatesToSet(set.id, validatedEstimates, responsibilityInfo.disease)
    }

    private fun populateStochasticBurdenEstimateSet(set: BurdenEstimateSet, responsibilityInfo: ResponsibilityInfo,
                                                    estimates: Sequence<BurdenEstimateWithRunId>)
    {
        val validatedEstimates = estimates.validateStochastic()
        burdenEstimateRepository.getEstimateWriter(set)
                .addEstimatesToSet(set.id, validatedEstimates, responsibilityInfo.disease)
    }
}