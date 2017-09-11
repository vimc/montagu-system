package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.BurdenEstimateSet
import java.time.Instant

interface BurdenEstimateRepository : Repository
{
    val touchstoneRepository: TouchstoneRepository

    /** Returns the database ID of the newly created burden estimate set **/
    fun addBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                             set: BurdenEstimateSet, uploader: String, timestamp: Instant): Int
}