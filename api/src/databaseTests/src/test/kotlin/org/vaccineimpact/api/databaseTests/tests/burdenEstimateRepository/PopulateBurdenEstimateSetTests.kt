package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.direct.addBurdenEstimate
import org.vaccineimpact.api.db.direct.addCountries
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.expectations.CohortRestriction
import org.vaccineimpact.api.models.expectations.CountryOutcomeExpectations
import java.io.InvalidObjectException
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
    fun `can update burden estimate set original filename`()
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
    fun `cannot update current stochastic estimate set`()
    {
        val (returnedIds, setId) = withDatabase { db ->
            setupDatabaseWithBurdenEstimateSetAndReturnIds(db, type = "stochastic")
        }
        withRepo {
            assertThatThrownBy {  it.updateCurrentBurdenEstimateSet(returnedIds.responsibility, setId,
                    BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC))
            }.isInstanceOf(InvalidOperationError::class.java)
        }
    }

    @Test
    fun `validateEstimates returns a map with missing rows`()
    {
        val years = 2000..2010
        val ages = 0..10
        val expectations = CountryOutcomeExpectations(1, "", years, ages, CohortRestriction(null, null),
                listOf(Country("ABC", "a"), Country("DEF", "d")), listOf(Outcome("cases", "cases names")))

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

    @Test
    fun `can add problems to burden estimate set`()
    {
        val setId = withDatabase { db ->
            setupDatabaseWithBurdenEstimateSet(db)
        }

        withDatabase { db ->
            val t = Tables.BURDEN_ESTIMATE_SET_PROBLEM
            assertThat(db.dsl.fetchCount(t, t.BURDEN_ESTIMATE_SET.eq(setId))).isEqualTo(0)
        }

        withRepo {
            it.addBurdenEstimateSetProblem(setId, "a problem")
            it.addBurdenEstimateSetProblem(setId, "yet another problem")
        }

        withDatabase { db ->
            val t = Tables.BURDEN_ESTIMATE_SET_PROBLEM
            assertThat(db.dsl.fetchCount(t, t.BURDEN_ESTIMATE_SET.eq(setId))).isEqualTo(2)
        }
    }

}