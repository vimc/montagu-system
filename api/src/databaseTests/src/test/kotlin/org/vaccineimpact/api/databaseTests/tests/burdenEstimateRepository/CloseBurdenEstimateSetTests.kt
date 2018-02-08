package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.databaseTests.tests.BurdenEstimateRepositoryTests
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET
import org.vaccineimpact.api.db.direct.*

class CloseBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can close burden estimate set`()
    {
        val setId = withDatabase {
            val setId = setupDatabaseWithBurdenEstimateSet(it, status = "partial")
            it.addBurdenEstimate(setId, "AFG")
            setId
        }
        withRepo { repo ->
            repo.closeBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId)
        }
        withDatabase { db ->
            val record = db.dsl.fetchOne(BURDEN_ESTIMATE_SET)
            assertThat(record.status).isEqualTo("complete")
        }
    }

    @Test
    fun `cannot close empty burden estimate set`()
    {
        val setId = withDatabase {
            setupDatabaseWithBurdenEstimateSet(it)
        }
        withRepo { repo ->
            assertThatThrownBy {
                repo.closeBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId)
            }.isInstanceOf(InvalidOperationError::class.java)
        }
        withDatabase { db ->
            val record = db.dsl.fetchOne(BURDEN_ESTIMATE_SET)
            assertThat(record.status).isEqualTo("empty")
        }
    }

    @Test
    fun `cannot close burden estimate set that belongs to other group`()
    {
        // Create another group that is also responsible for the same scenario in the same touchstone
        val otherGroup = "other-group"
        withDatabase {
            setupDatabase(it)
            it.addGroup(otherGroup, "Other test group")
            val responsibilitySet = it.addResponsibilitySet(otherGroup, touchstoneId)
            it.addResponsibility(responsibilitySet, touchstoneId, scenarioId)
        }
        assertCannotCloseEstimateSetWithWrongPath(closeGroupId = otherGroup)
    }

    @Test
    fun `cannot close burden estimate set with wrong touchstone`()
    {
        // Create another touchstone in which the modelling group
        // is also responsible for the same scenario
        val otherTouchstone = "touchstone-2"
        withDatabase {
            setupDatabase(it)
            it.addTouchstone("touchstone", 2)
            val responsibilitySet = it.addResponsibilitySet(groupId, otherTouchstone)
            it.addResponsibility(responsibilitySet, otherTouchstone, scenarioId)
        }
        assertCannotCloseEstimateSetWithWrongPath(closeTouchstoneId = otherTouchstone)
    }

    @Test
    fun `cannot close burden estimate set with wrong scenario`()
    {
        // Create another scenario that the modelling group is responsible for in
        // this scenario
        val otherScenario = "scenario-2"
        withDatabase {
            val ids = setupDatabase(it)
            it.addScenarioDescription(otherScenario, "Other scenario", diseaseId)
            it.addResponsibility(ids.responsibilitySetId, touchstoneId, otherScenario)
        }
        assertCannotCloseEstimateSetWithWrongPath(closeScenarioId = otherScenario)
    }

    private fun assertCannotCloseEstimateSetWithWrongPath(
            closeGroupId: String = groupId,
            closeTouchstoneId: String = touchstoneId,
            closeScenarioId: String = scenarioId
    )
    {
        withRepo { repo ->
            val setId = repo.createBurdenEstimateSet(groupId,
                    touchstoneId, scenarioId, defaultProperties, username, timestamp)
            assertThatThrownBy { repo.closeBurdenEstimateSet(setId, closeGroupId, closeTouchstoneId, closeScenarioId) }
                    .isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("Unknown burden-estimate-set with id '1'")
        }
    }
}