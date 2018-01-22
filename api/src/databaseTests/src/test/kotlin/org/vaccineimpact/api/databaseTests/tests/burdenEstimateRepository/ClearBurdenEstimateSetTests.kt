package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.verifyZeroInteractions
import org.assertj.core.api.Assertions
import org.junit.Test
import org.mockito.internal.verification.Times
import org.vaccineimpact.api.app.errors.OperationNotAllowedError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.burdenestimates.CentralBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.StochasticBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.JooqBurdenEstimateRepository
import org.vaccineimpact.api.databaseTests.tests.BurdenEstimateRepositoryTests
import org.vaccineimpact.api.db.JooqContext

class ClearBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can clear central estimates`()
    {
        withDatabase { db ->
            val setId = setupDatabaseWithBurdenEstimateSet(db, type = "central-averaged")
            val (repo, central, stochastic) = getRepoWithMockedWriters(db)
            repo.clearBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId)
            verify(central, Times(1)).clearEstimateSet(setId)
            verifyZeroInteractions(stochastic)
        }
    }

    @Test
    fun `can clear stochastic estimates`()
    {
        withDatabase { db ->
            val setId = setupDatabaseWithBurdenEstimateSet(db, type = "stochastic")
            val (repo, central, stochastic) = getRepoWithMockedWriters(db)
            repo.clearBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId)
            verify(stochastic, Times(1)).clearEstimateSet(setId)
            verifyZeroInteractions(central)
        }
    }

    @Test
    fun `cannot clear complete estimate set`()
    {
        val setId = withDatabase { setupDatabaseWithBurdenEstimateSet(it, status = "complete") }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.clearBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId)
            }.isInstanceOf(OperationNotAllowedError::class.java)
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
            repo.clearBurdenEstimateSet(setId, "wrong-id", touchstoneId, scenarioId)
        }
    }

    @Test
    fun `cannot clear burden estimate set if scenario doesn't exist`()
    {
        assertUnknownObjectError { repo, setId ->
            repo.clearBurdenEstimateSet(setId, groupId, touchstoneId, "wrong-id")
        }
    }

    @Test
    fun `cannot clear burden estimate set if set doesn't exist`()
    {
        assertUnknownObjectError { repo, setId ->
            repo.clearBurdenEstimateSet(setId + 1, groupId, touchstoneId, scenarioId)
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

    data class RepoAndWriters(
            val repo: JooqBurdenEstimateRepository,
            val central: CentralBurdenEstimateWriter,
            val stochastic: StochasticBurdenEstimateWriter
    )

    private fun getRepoWithMockedWriters(db: JooqContext): RepoAndWriters
    {
        val central = mock<CentralBurdenEstimateWriter>()
        val stochastic = mock<StochasticBurdenEstimateWriter>()
        val repo = makeRepository(db, central, stochastic)
        return RepoAndWriters(repo, central, stochastic)
    }
}