package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.ExpectationMapping
import org.vaccineimpact.api.models.Expectations

interface ExpectationsRepository : Repository
{
    fun getExpectationsForResponsibility(responsibilityId: Int): Expectations
    fun getExpectationsForResponsibilitySet(modellingGroup: String, touchstoneVersion: String): List<ExpectationMapping>
    fun getExpectationsById(expectationsId: Int): Expectations
    fun getExpectationIdsForGroupAndTouchstone(groupId: String, touchstoneVersionId: String): List<Int>
}
