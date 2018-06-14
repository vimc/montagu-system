package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.db.tables.records.ResponsibilitySetRecord
import org.vaccineimpact.api.models.*

interface ResponsibilitiesRepository: Repository {
    fun getResponsibilitiesForTouchstone(touchstoneVersionId: String): List<ResponsibilitySet>
    fun getResponsibilities(responsibilitySet: ResponsibilitySetRecord?,
                            scenarioFilterParameters: ScenarioFilterParameters,
                            touchstoneVersionId: String): Responsibilities
    fun getResponsibility(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityAndTouchstone
    fun getResponsibilitiesForGroupAndTouchstone(groupId: String, touchstoneVersionId: String,
                                                 scenarioFilterParameters: ScenarioFilterParameters): ResponsibilitiesAndTouchstoneStatus
}