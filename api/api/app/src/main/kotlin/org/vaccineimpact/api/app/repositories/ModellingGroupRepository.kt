package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.models.ModellingGroup
import org.vaccineimpact.api.app.models.Responsibilities
import java.io.Closeable

interface ModellingGroupRepository : Closeable
{
    val modellingGroups: SimpleDataSet<ModellingGroup, String>

    fun getResponsibilities(groupId: String, touchstoneId: String,
                            scenarioFilterParameters: ScenarioFilterParameters): Responsibilities
}