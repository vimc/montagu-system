package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.repositories.burdenestimates.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.FlexibleDataTable
import java.time.Instant

interface BurdenEstimateRepository : Repository
{
    val touchstoneRepository: TouchstoneRepository

    /** Returns the database ID of the newly created burden estimate set **/
    fun createBurdenEstimateSet(groupId: String, touchstoneVersionId: String, scenarioId: String,
                                properties: CreateBurdenEstimateSet,
                                uploader: String, timestamp: Instant): Int

    fun getBurdenEstimateSet(setId: Int): BurdenEstimateSet
    fun getBurdenEstimateSets(groupId: String, touchstoneVersionId: String, scenarioId: String): List<BurdenEstimateSet>

    fun clearBurdenEstimateSet(setId: Int, groupId: String, touchstoneVersionId: String, scenarioId: String)

    fun addModelRunParameterSet(groupId: String, touchstoneVersionId: String, disease: String,
                                modelRuns: List<ModelRun>,
                                uploader: String, timestamp: Instant): Int

    fun getModelRunParameterSets(groupId: String, touchstoneVersionId: String): List<ModelRunParameterSet>

    fun getModelRunParameterSet(setId: Int): FlexibleDataTable<ModelRun>
    fun changeBurdenEstimateStatus(setId: Int, newStatus: BurdenEstimateSetStatus)
    fun updateCurrentBurdenEstimateSet(responsibilityId: Int, setId: Int, type: BurdenEstimateSetType)
    fun getEstimateWriter(set: BurdenEstimateSet): BurdenEstimateWriter
    fun getBurdenEstimateSetForResponsibility(setId: Int, responsibilityId: Int): BurdenEstimateSet
    fun getResponsibilityInfo(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityInfo
    fun validateEstimates(set: BurdenEstimateSet, expectedRowMap: HashMap<String, HashMap<Short, HashMap<Short, Boolean>>>)
}
