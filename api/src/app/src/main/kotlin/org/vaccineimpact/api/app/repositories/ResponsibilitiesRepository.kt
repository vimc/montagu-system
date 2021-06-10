package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.db.tables.records.ResponsibilitySetRecord
import org.vaccineimpact.api.models.responsibilities.ResponsibilityAndTouchstone
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySet
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithComments
import java.time.Instant

interface ResponsibilitiesRepository: Repository {
    fun getResponsibilitiesForTouchstone(touchstoneVersionId: String): List<ResponsibilitySet>
    fun getResponsibilitiesWithCommentsForTouchstone(touchstoneVersionId: String): List<ResponsibilitySetWithComments>
    fun addResponsibilityCommentForTouchstone(touchstoneVersionId: String,
                                              groupId: String,
                                              scenarioId: String,
                                              comment: String,
                                              addedBy: String,
                                              addedOn: Instant? = Instant.now())
    fun getResponsibilities(responsibilitySet: ResponsibilitySetRecord?,
                            scenarioFilterParameters: ScenarioFilterParameters,
                            touchstoneVersionId: String,
                            modellingGroupId: String): ResponsibilitySet
    @Throws(UnknownObjectError::class)
    fun getResponsibility(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityAndTouchstone
    @Throws(UnknownObjectError::class)
    fun getResponsibilitiesForGroup(groupId: String,
                                    touchstoneVersionId: String,
                                    scenarioFilterParameters: ScenarioFilterParameters): ResponsibilitySet

    @Throws(UnknownObjectError::class)
    fun getResponsibilityId(groupId: String, touchstoneVersionId: String, scenarioId: String): Int
}