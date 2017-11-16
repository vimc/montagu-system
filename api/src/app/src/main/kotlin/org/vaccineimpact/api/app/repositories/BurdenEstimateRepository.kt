package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.models.BurdenEstimateSet
import java.time.Instant

interface BurdenEstimateRepository : Repository
{
    val touchstoneRepository: TouchstoneRepository

    /** Returns the database ID of the newly created burden estimate set **/
    fun createBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                                uploader: String, timestamp: Instant): Int

    fun getBurdenEstimateSets(groupId: String, touchstoneId: String, scenarioId: String): Sequence<BurdenEstimateSet>

    /** Deprecated **/
    fun addBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                             estimates: List<BurdenEstimate>, uploader: String, timestamp: Instant): Int

    fun populateBurdenEstimateSet(setId: Int, groupId: String, touchstoneId: String, scenarioId: String,
                             estimates: List<BurdenEstimate>)

}