package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.verifyZeroInteractions
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.mockito.internal.verification.Times
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.burdenestimates.CentralBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.JooqBurdenEstimateRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet
import org.vaccineimpact.api.db.direct.addResponsibility
import org.vaccineimpact.api.db.direct.addScenarioDescription

class ClearBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can clear central estimates`()
    {
        withDatabase { db ->
            val setId = setupDatabaseWithBurdenEstimateSet(db, type = "central-averaged")
            val (repo, central) = getRepoWithMockedWriter(db)
            repo.clearBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
            verify(central, Times(1)).clearEstimateSet(setId)
        }
    }

    @Test
    fun `clearing changes status back to empty`()
    {
        val setId = withDatabase { setupDatabaseWithBurdenEstimateSet(it, status = "partial") }
        withRepo { repo ->
            repo.clearBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }
        withDatabase { db ->
            val record = db.dsl.fetchOne(BURDEN_ESTIMATE_SET, BURDEN_ESTIMATE_SET.ID.eq(setId))
            assertThat(record.status).isEqualTo("empty")
        }
    }

    @Test
    fun `cannot clear complete estimate set`()
    {
        val setId = withDatabase { setupDatabaseWithBurdenEstimateSet(it, status = "complete") }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.clearBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
            }.isInstanceOf(InvalidOperationError::class.java)
        }
    }

    @Test
    fun `cannot clear burden estimate set if touchstone doesn't exist`()
    {
        assertUnknownObjectError { repo, setId ->
            repo.clearBurdenEstimateSet(setId, groupId, "wrong-id", scenarioId)
        }
    }

    @Test
    fun `cannot clear burden estimate set if group doesn't exist`()
    {
        assertUnknownObjectError { repo, setId ->
            repo.clearBurdenEstimateSet(setId, "wrong-id", touchstoneVersionId, scenarioId)
        }
    }

    @Test
    fun `cannot clear burden estimate set if scenario doesn't exist`()
    {
        assertUnknownObjectError { repo, setId ->
            repo.clearBurdenEstimateSet(setId, groupId, touchstoneVersionId, "wrong-id")
        }
    }

    @Test
    fun `cannot clear burden estimate set if set doesn't exist`()
    {
        assertUnknownObjectError { repo, setId ->
            repo.clearBurdenEstimateSet(setId + 1, groupId, touchstoneVersionId, scenarioId)
        }
    }

    @Test
    fun `cannot clear burden estimate set if set belongs to different responsibility`()
    {
        val scenario2 = "scenario-2"
        val setId = withDatabase {
            val returnedIds = setupDatabase(it)
            it.addScenarioDescription(scenario2, "Test scenario 2", diseaseId, addDisease = false)
            val responsibilityId = it.addResponsibility(returnedIds.responsibilitySetId, touchstoneVersionId, scenario2)
            it.addBurdenEstimateSet(responsibilityId, returnedIds.modelVersion!!, username, "partial")
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.clearBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    private fun assertUnknownObjectError(work: (repo: BurdenEstimateRepository, setId: Int) -> Any)
    {
        val setId = withDatabase { setupDatabaseWithBurdenEstimateSet(it) }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                work(repo, setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    data class RepoAndWriter(
            val repo: JooqBurdenEstimateRepository,
            val central: CentralBurdenEstimateWriter
    )

    private fun getRepoWithMockedWriter(db: JooqContext): RepoAndWriter
    {
        val central = mock<CentralBurdenEstimateWriter>()
        val repo = makeRepository(db, central)
        return RepoAndWriter(repo, central)
    }
}