package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.burdenestimates.CentralBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.StochasticBurdenEstimateWriter
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.BurdenEstimateSetStatus
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import java.time.Instant

class PopulateBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{

    @Test
    fun `can update set status`()
    {
        val setId = withDatabase { db ->
            setupDatabaseWithBurdenEstimateSet(db, type = "central-averaged")
        }
        withRepo {
            it.changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.PARTIAL)
        }

        withDatabase { db ->
            val t = Tables.BURDEN_ESTIMATE_SET
            val set = db.dsl.selectFrom(t).where(t.ID.eq(setId)).fetchOne()
            Assertions.assertThat(set[t.STATUS]).isEqualTo("partial")
        }
    }

    @Test
    fun `can update current central estimate set`()
    {
        val (returnedIds, setId) = withDatabase { db ->
            setupDatabaseWithBurdenEstimateSetAndReturnIds(db, type = "central-averaged")
        }
        withRepo {
            it.updateCurrentBurdenEstimateSet(returnedIds.responsibility, setId,
                    BurdenEstimateSetTypeCode.CENTRAL_AVERAGED)
        }

        withDatabase { db ->
            val t = Tables.RESPONSIBILITY
            val r = db.dsl.selectFrom(t).where(t.ID.eq(returnedIds.responsibility)).fetchOne()
            Assertions.assertThat(r[t.CURRENT_BURDEN_ESTIMATE_SET]).isEqualTo(setId)
        }
    }

    @Test
    fun `can update current stochastic estimate set`()
    {
        val (returnedIds, setId) = withDatabase { db ->
            setupDatabaseWithBurdenEstimateSetAndReturnIds(db, type = "stochastic")
        }
        withRepo {
            it.updateCurrentBurdenEstimateSet(returnedIds.responsibility, setId,
                    BurdenEstimateSetTypeCode.STOCHASTIC)
        }

        withDatabase { db ->
            val t = Tables.RESPONSIBILITY
            val r = db.dsl.selectFrom(t).where(t.ID.eq(returnedIds.responsibility)).fetchOne()
            Assertions.assertThat(r[t.CURRENT_STOCHASTIC_BURDEN_ESTIMATE_SET]).isEqualTo(setId)
        }
    }

    @Test
    fun `gets central estimate writer when set type is stochastic`()
    {
        val centralEstimateSet = BurdenEstimateSet(
                1, Instant.now(), "test.user",
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"),
                BurdenEstimateSetStatus.EMPTY,
                emptyList()
        )
        withRepo {
            val result = it.getEstimateWriter(centralEstimateSet)
            assertThat(result is CentralBurdenEstimateWriter).isTrue()
        }
    }

    @Test
    fun `gets stochastic estimate writer when set type is stochastic`()
    {
        val stochasticEstimateSet = BurdenEstimateSet(
                1, Instant.now(), "test.user",
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC, "mean"),
                BurdenEstimateSetStatus.EMPTY,
                emptyList()
        )
        withRepo {
            val result = it.getEstimateWriter(stochasticEstimateSet)
            assertThat(result is StochasticBurdenEstimateWriter).isTrue()
        }

    }

}