package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.CreateBurdenEstimateSet
import org.vaccineimpact.api.models.ModelRun
import java.time.Instant

interface BurdenEstimateRepository : Repository
{
    val touchstoneRepository: TouchstoneRepository

    /** Returns the database ID of the newly created burden estimate set **/
    fun createBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                                properties: CreateBurdenEstimateSet,
                                uploader: String, timestamp: Instant): Int

    fun getBurdenEstimateSets(groupId: String, touchstoneId: String, scenarioId: String): List<BurdenEstimateSet>

    @Deprecated("Instead use createBurdenEstimateSet and then populateBurdenEstimateSet")
    fun addBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                             estimates: List<BurdenEstimate>, uploader: String, timestamp: Instant): Int

    fun populateBurdenEstimateSet(setId: Int, groupId: String, touchstoneId: String, scenarioId: String,
                                  estimates: List<BurdenEstimate>)

    fun addModelRunParameterSet(groupId: String, touchstoneId: String, scenarioId: String, description: String,
                                modelRuns: List<ModelRun>,
                                uploader: String, timestamp: Instant): Int
}
