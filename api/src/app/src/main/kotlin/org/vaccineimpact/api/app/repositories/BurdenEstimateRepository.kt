package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.models.BurdenEstimateOutcome
import org.vaccineimpact.api.app.repositories.burdenestimates.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.expectations.RowLookup
import org.vaccineimpact.api.serialization.FlexibleDataTable
import java.time.Instant

interface BurdenEstimateRepository : Repository
{
    val touchstoneRepository: TouchstoneRepository

    val centralEstimateWriter: BurdenEstimateWriter

    /** Returns the database ID of the newly created burden estimate set **/
    fun createBurdenEstimateSet(responsibilityId: Int,
                                modelVersionId: Int,
                                properties: CreateBurdenEstimateSet,
                                uploader: String,
                                timestamp: Instant): Int

    fun getBurdenEstimateSet(groupId: String, touchstoneVersionId: String, scenarioId: String,
                             burdenEstimateSetId: Int): BurdenEstimateSet

    fun getBurdenEstimateSets(groupId: String, touchstoneVersionId: String, scenarioId: String): List<BurdenEstimateSet>

    fun clearBurdenEstimateSet(setId: Int, groupId: String, touchstoneVersionId: String, scenarioId: String)

    fun addModelRunParameterSet(groupId: String, touchstoneVersionId: String, modelVersionId: Int,
                                modelRuns: List<ModelRun>,
                                uploader: String, timestamp: Instant): Int

    fun getModelRunParameterSets(groupId: String, touchstoneVersionId: String): List<ModelRunParameterSet>
    fun checkModelRunParameterSetExists(modelRunParameterSetId: Int, groupId: String, touchstoneVersionId: String)

    fun getModelRunParameterSet(groupId: String, touchstoneVersionId: String, setId: Int): FlexibleDataTable<ModelRun>
    fun changeBurdenEstimateStatus(setId: Int, newStatus: BurdenEstimateSetStatus)
    fun updateCurrentBurdenEstimateSet(responsibilityId: Int, setId: Int, type: BurdenEstimateSetType)
    fun getBurdenEstimateSetForResponsibility(setId: Int, responsibilityId: Int): BurdenEstimateSet

    @Throws(UnknownObjectError::class)
    fun getResponsibilityInfo(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityInfo

    fun validateEstimates(set: BurdenEstimateSet,
                          expectedRowMap: RowLookup)
            : RowLookup

    fun getBurdenOutcomeIds(matching: String): List<Short>

    fun getEstimates(setId: Int, responsibilityId: Int, outcomeIds: List<Short>,
                     burdenEstimateGrouping: BurdenEstimateGrouping = BurdenEstimateGrouping.AGE):
            BurdenEstimateDataSeries

    fun getBurdenEstimateOutcomesSequence(groupId: String, touchstoneVersionId: String, scenarioId: String, burdenEstimateSetId: Int)
            : Sequence<BurdenEstimateOutcome>

    fun getExpectedOutcomesForBurdenEstimateSet(burdenEstimateSetId: Int): List<String>

    fun updateBurdenEstimateSetFilename(setId: Int, filename: String?)
}
