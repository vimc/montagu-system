package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.db.tables.ScenarioDescription
import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.ModelRun
import java.time.Instant

interface BurdenEstimateRepository : Repository
{
    val touchstoneRepository: TouchstoneRepository

    fun getBurdenEstimateSets(groupId: String, touchstoneId: String, scenarioId: String): Sequence<BurdenEstimateSet>

    /** Returns the database ID of the newly created burden estimate set **/
    fun addBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                             estimates: List<BurdenEstimate>, uploader: String, timestamp: Instant): Int

    fun addModelRunParameterSet(responsibilitySetId: Int, modelVersionId: Int, description: String,
                                uploader: String, timestamp: Instant,
                                modelRuns: List<ModelRun>)
}