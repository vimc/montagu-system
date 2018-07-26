package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.ExpectationMapping
import org.vaccineimpact.api.models.Expectations

interface ExpectationsRepository : Repository
{
    fun getExpectationsForResponsibility(responsibilityId: Int): ExpectationMapping
    fun getExpectationsForResponsibilitySet(modellingGroup: String, touchstoneVersion: String): List<ExpectationMapping>
    fun getExpectationsById(expectationsId: Int): ExpectationMapping
    fun getExpectationIdsForGroupAndTouchstone(groupId: String, touchstoneVersionId: String): List<Int>
}
