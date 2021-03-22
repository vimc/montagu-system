package org.vaccineimpact.api.app.logic

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.db.ConfigWrapper
import org.vaccineimpact.api.models.BurdenEstimateSetStatus

interface Notifier
{
    fun notify(
            groupId: String, disease: String, scenarioId: String, burdenEstimateSetStatus: BurdenEstimateSetStatus,
            responsibilitySetComplete: Boolean, touchstone: String
    )
}

class FlowNotifier(
        private val client: HttpClient = KHttpClient(),
        private val appConfig: ConfigWrapper = Config
) : Notifier
{
    private val logger = LoggerFactory.getLogger(FlowNotifier::class.java)

    override fun notify(
            groupId: String,
            disease: String,
            scenarioId: String,
            burdenEstimateSetStatus: BurdenEstimateSetStatus,
            responsibilitySetComplete: Boolean,
            touchstone: String
    )
    {
        try
        {
            client.post(appConfig["flow.url"], emptyMap(), mapOf(
                    "groupId" to groupId,
                    "disease" to disease,
                    "scenarioId" to scenarioId,
                    "burdenEstimateSetStatus" to burdenEstimateSetStatus.name,
                    "responsibilitySetComplete" to responsibilitySetComplete,
                    "touchstone" to touchstone
            ))
        }
        catch (e: Exception)
        {
            logger.warn("There was a problem sending the Flow message: ${e.message}")
        }
    }
}
