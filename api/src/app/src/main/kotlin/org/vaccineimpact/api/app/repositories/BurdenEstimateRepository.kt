package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.models.BurdenEstimateSet
import java.time.Instant

interface BurdenEstimateRepository : Repository
{
    val touchstoneRepository: TouchstoneRepository

    fun getBurdenEstimateSets(groupId: String, touchstoneId: String, scenarioId: String): List<BurdenEstimateSet>

    /** Returns the database ID of the newly created burden estimate set **/
    fun addBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                             estimates: List<BurdenEstimate>, uploader: String, timestamp: Instant): Int
}