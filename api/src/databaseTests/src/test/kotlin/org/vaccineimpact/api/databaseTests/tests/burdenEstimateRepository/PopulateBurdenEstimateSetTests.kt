package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.burdenestimates.CentralBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.StochasticBurdenEstimateWriter
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.direct.addBurdenEstimate
import org.vaccineimpact.api.db.direct.addCountries
import org.vaccineimpact.api.models.*
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
    fun `can update set filename`()
    {
        val setId = withDatabase { db ->
            setupDatabaseWithBurdenEstimateSet(db, type = "central-averaged")
        }
        withRepo {
            it.updateBurdenEstimateSetFilename(setId, "file.csv")
        }

        withDatabase { db ->
            val t = Tables.BURDEN_ESTIMATE_SET
            val set = db.dsl.selectFrom(t).where(t.ID.eq(setId)).fetchOne()
            Assertions.assertThat(set[t.ORIGINAL_FILENAME]).isEqualTo("file.csv")
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
                    BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED))
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
                    BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC))
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
                emptyList(),
                null
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
                emptyList(),
                null
        )
        withRepo {
            val result = it.getEstimateWriter(stochasticEstimateSet)
            assertThat(result is StochasticBurdenEstimateWriter).isTrue()
        }

    }

    @Test
    fun `validateEstimates returns a map with missing rows`()
    {
        val years = 2000..2010
        val ages = 0..10
        val expectations = CountryOutcomeExpectations(1, "", years, ages, CohortRestriction(null, null),
                listOf(Country("ABC", "a"), Country("DEF", "d")), listOf("cases"))

        val setId = withDatabase { db ->
            val (_, setId) = setupDatabaseWithBurdenEstimateSetAndReturnIds(db)
            db.addCountries(listOf("ABC", "DEF"))
            for (year in years)
            {
                for (age in ages)
                {
                    db.addBurdenEstimate(setId, "ABC", year = year.toShort(), age = age.toShort(), outcome = "cases")

                    if (year > 2005)
                    {
                        db.addBurdenEstimate(setId, "DEF", year = year.toShort(), age = age.toShort(), outcome = "cases")
                    }
                }
            }

            setId
        }

        val burdenEstimateSet = BurdenEstimateSet(setId, Instant.now(), "",
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED),
                BurdenEstimateSetStatus.EMPTY, listOf(), null)

        val result = withRepo {
            it.validateEstimates(burdenEstimateSet,
                    expectations.expectedRowLookup())
        }

        for (year in years)
        {
            for (age in ages)
            {
                assertThat(result["ABC"]!![age.toShort()]!![year.toShort()]!!).isTrue()

                if (year > 2005)
                {
                    assertThat(result["DEF"]!![age.toShort()]!![year.toShort()]!!).isTrue()
                }
                else
                {
                    assertThat(result["DEF"]!![age.toShort()]!![year.toShort()]!!).isFalse()
                }

            }
        }
    }

}