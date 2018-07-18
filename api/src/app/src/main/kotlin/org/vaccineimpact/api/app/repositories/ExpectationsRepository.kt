package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.Expectations

interface ExpectationsRepository : Repository
{
    fun getExpectations(expectationId: Int): Expectations
}
