package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.junit.Test
import org.vaccineimpact.api.databaseTests.tests.BurdenEstimateRepositoryTests

class CloseBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can close burden estimate set`()
    {
        val returnedIds = withDatabase { setupDatabase(it) }
        val setId = withRepo { repo ->
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
            repo.closeBurdenEstimateSet(setId)
            setId
        }
        withDatabase { db ->
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "complete")
        }
    }
}