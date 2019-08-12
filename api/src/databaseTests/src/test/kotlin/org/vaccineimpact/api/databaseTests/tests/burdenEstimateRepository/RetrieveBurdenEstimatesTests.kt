package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.Tables.BURDEN_OUTCOME
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.BurdenEstimateGrouping
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import java.time.Instant

class RetrieveBurdenEstimatesTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can get outcome ids matching string`()
    {
        val result = withRepo {
            it.getBurdenOutcomeIds("deaths")
        }

        val outcomes = withDatabase {
            it.dsl.selectFrom(BURDEN_OUTCOME)
                    .where(BURDEN_OUTCOME.ID.`in`(result))
                    .fetch()
        }

        assertThat(result.count()).isGreaterThan(1)
        assertThat(outcomes.all { it.code.contains("deaths") }).isTrue()
    }

    @Test
    fun `can get estimates for responsibility grouped by age`()
    {

        val (responsibilityId, outcomeId, setId) = withDatabase {
            val ids = setupDatabase(it)
            val modelVersionId = ids.modelVersion!!
            val setId = it.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)

            for (a in 1..10)
            {
                for (y in 2000..2003)
                {
                    it.addBurdenEstimate(setId, "AFG", year = y.toShort(), age = a.toShort(), outcome = "deaths")
                    it.addBurdenEstimate(setId, "AGO", year = y.toShort(), age = a.toShort(), outcome = "deaths")
                }
            }

            val outcomeId = it.dsl.select(Tables.BURDEN_OUTCOME.ID)
                    .from(Tables.BURDEN_OUTCOME)
                    .where(Tables.BURDEN_OUTCOME.CODE.eq("deaths"))
                    .fetchOne().value1()

            Triple(ids.responsibility, outcomeId, setId)
        }

        val result = withRepo {
            it.getEstimates(setId, responsibilityId, listOf(outcomeId))
        }

        assertThat(result.burdenEstimateGrouping).isEqualTo(BurdenEstimateGrouping.AGE)
        assertThat(result.data.keys).hasSameElementsAs((1..10).map { it.toShort() })
        assertThat(result.data.values.all { it.count() == 4 }).isTrue()
        assertThat(result.data.values.all { it.all { it.value == 200F } }).isTrue()
    }

    @Test
    fun `can get estimates grouped by year`()
    {

        val (responsibilityId, outcomeId, setId) = withDatabase {
            val ids = setupDatabase(it)
            val modelVersionId = ids.modelVersion!!
            val setId = it.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)

            for (a in 1..10)
            {
                for (y in 2000..2003)
                {
                    it.addBurdenEstimate(setId, "AFG", year = y.toShort(), age = a.toShort(), outcome = "deaths")
                    it.addBurdenEstimate(setId, "AGO", year = y.toShort(), age = a.toShort(), outcome = "deaths")
                }
            }

            val outcomeId = it.dsl.select(Tables.BURDEN_OUTCOME.ID)
                    .from(Tables.BURDEN_OUTCOME)
                    .where(Tables.BURDEN_OUTCOME.CODE.eq("deaths"))
                    .fetchOne().value1()

            Triple(ids.responsibility, outcomeId, setId)
        }

        val result = withRepo {
            it.getEstimates(setId, responsibilityId, listOf(outcomeId), BurdenEstimateGrouping.YEAR)
        }

        assertThat(result.burdenEstimateGrouping).isEqualTo(BurdenEstimateGrouping.YEAR)
        assertThat(result.data.keys).hasSameElementsAs((2000..2003).map { it.toShort() })
        assertThat(result.data.values.all { it.count() == 10 }).isTrue()
        assertThat(result.data.values.all { it.all { it.value == 200F } }).isTrue()
    }

    @Test
    fun `does not get estimates for wrong set`()
    {

        val (outcomeId, responsibilityId, badSetId) = withDatabase {
            val ids = setupDatabase(it)
            val modelVersionId = ids.modelVersion!!
            val setId = it.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)
            val badSetId = it.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)

            for (a in 1..10)
            {
                for (y in 2000..2003)
                {
                    it.addBurdenEstimate(setId, "AFG", year = y.toShort(), age = a.toShort(), outcome = "deaths")
                    it.addBurdenEstimate(setId, "AGO", year = y.toShort(), age = a.toShort(), outcome = "deaths")
                }
            }

            val outcomeId = it.dsl.select(Tables.BURDEN_OUTCOME.ID)
                    .from(Tables.BURDEN_OUTCOME)
                    .where(Tables.BURDEN_OUTCOME.CODE.eq("deaths"))
                    .fetchOne().value1()

            Triple(outcomeId, ids.responsibility, badSetId)
        }

        val result = withRepo {
            it.getEstimates(badSetId, responsibilityId, listOf(outcomeId)).data
        }

        assertThat(result.keys.count()).isEqualTo(0)
    }

    @Test
    fun `getEstimates throws error if set does not belong to responsibility`()
    {

        val (outcomeId, setId) = withDatabase {
            val ids = setupDatabase(it)
            val modelVersionId = ids.modelVersion!!
            val setId = it.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)

            for (a in 1..10)
            {
                for (y in 2000..2003)
                {
                    it.addBurdenEstimate(setId, "AFG", year = y.toShort(), age = a.toShort(), outcome = "deaths")
                    it.addBurdenEstimate(setId, "AGO", year = y.toShort(), age = a.toShort(), outcome = "deaths")
                }
            }

            val outcomeId = it.dsl.select(Tables.BURDEN_OUTCOME.ID)
                    .from(Tables.BURDEN_OUTCOME)
                    .where(Tables.BURDEN_OUTCOME.CODE.eq("deaths"))
                    .fetchOne().value1()

            Pair(outcomeId, setId)
        }

        withRepo {
            assertThatThrownBy {
                it.getEstimates(setId, 67, listOf(outcomeId))
            }.isInstanceOf(UnknownObjectError::class.java).hasMessageContaining("burden-estimate-set")
        }

    }

    @Test
    fun `does not get estimates for wrong outcomes`()
    {

        val (responsibilityId, outcomeId, setId) = withDatabase {
            val ids = setupDatabase(it)
            val modelVersionId = ids.modelVersion!!
            val setId = it.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)
            it.updateCurrentEstimate(ids.responsibility, setId)

            for (a in 1..10)
            {
                for (y in 2000..2003)
                {
                    it.addBurdenEstimate(setId, "AFG", year = y.toShort(), age = a.toShort(), outcome = "cases")
                    it.addBurdenEstimate(setId, "AGO", year = y.toShort(), age = a.toShort(), outcome = "cases")
                }
            }

            val outcomeId = it.dsl.select(Tables.BURDEN_OUTCOME.ID)
                    .from(Tables.BURDEN_OUTCOME)
                    .where(Tables.BURDEN_OUTCOME.CODE.eq("deaths"))
                    .fetchOne().value1()

            Triple(ids.responsibility, outcomeId, setId)
        }

        val result = withRepo {
            it.getEstimates(setId, responsibilityId, listOf(outcomeId)).data
        }

        assertThat(result.keys.count()).isEqualTo(0)
    }


    @Test
    fun `can retrieve burden estimate sets`()
    {
        val otherUser = "some.other.user"
        var setA = 0
        var setB = 0
        val before = Instant.now()
        given { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addUserForTesting(otherUser)
            setA = db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)
            setB = db.addBurdenEstimateSet(ids.responsibility, modelVersionId, "some.other.user", filename = "file.csv")
            db.addBurdenEstimateProblem("some problem", setB)
        } check { repo ->
            val after = Instant.now()
            val sets = repo.getBurdenEstimateSets(groupId, touchstoneVersionId, scenarioId).toList()
            val a = sets.single { it.id == setA }
            Assertions.assertThat(a.uploadedBy).isEqualTo(username)
            Assertions.assertThat(a.uploadedOn).isAfter(before)
            Assertions.assertThat(a.uploadedOn).isBefore(after)
            Assertions.assertThat(a.problems).isEmpty()
            Assertions.assertThat(a.originalFileName).isNull()

            val b = sets.single { it.id == setB }
            Assertions.assertThat(b.uploadedBy).isEqualTo("some.other.user")
            Assertions.assertThat(b.uploadedOn).isAfter(a.uploadedOn)
            Assertions.assertThat(b.uploadedOn).isBefore(after)
            Assertions.assertThat(b.problems).hasSameElementsAs(listOf("some problem"))
            Assertions.assertThat(b.originalFileName).isEqualTo("file.csv")
        }
    }

    @Test
    fun `can retrieve burden estimate set type`()
    {
        var setA = 0
        var setB = 0
        var setC = 0
        var setD = 0
        given { db ->
            val ids = setupDatabase(db)
            setA = addBurdenEstimateSet(db, ids, setType = "central-unknown", setTypeDetails = "unknown")
            setB = addBurdenEstimateSet(db, ids, setType = "central-single-run", setTypeDetails = null)
            setC = addBurdenEstimateSet(db, ids, setType = "central-averaged", setTypeDetails = "mean")
            setD = addBurdenEstimateSet(db, ids, setType = "stochastic", setTypeDetails = null)
        } check { repo ->
            val sets = repo.getBurdenEstimateSets(groupId, touchstoneVersionId, scenarioId)
            checkSetHasExpectedType(sets, setA, BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_UNKNOWN, "unknown"))
            checkSetHasExpectedType(sets, setB, BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN, null))
            checkSetHasExpectedType(sets, setC, BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"))
            checkSetHasExpectedType(sets, setD, BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC, null))
        }
    }

    @Test
    fun `can retrieve single burden estimate set`()
    {
        val setId = withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setType = "stochastic", filename = "file.csv")
        }
        withRepo { repo ->
            val set = repo.getBurdenEstimateSet(groupId, touchstoneVersionId, scenarioId,  setId)
            assertThat(set.uploadedBy).isEqualTo(username)
            assertThat(set.problems).isEmpty()
            assertThat(set.isStochastic()).isTrue()
            assertThat(set.originalFileName).isEqualTo("file.csv")
        }
    }

    @Test
    fun `getBurdenEstimateSet throws unknown object error if burden estimate set is in different touchstone`()
    {
        val touchstone2 = "touchstone-2"
        val setId = withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)
        }
        withDatabase { db ->
            db.addTouchstoneVersion("touchstone", 2)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateSet(groupId, touchstone2, scenarioId,  setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getBurdenEstimateSet throws unknown object error if burden estimate set is in different scenario`()
    {
        val scenario2 = "scenario-2"
        val setId = withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)
        }
        withDatabase { db ->
            db.addScenarioDescription(scenario2, "Test scenario 2", diseaseId, addDisease = false)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateSet(groupId, touchstoneVersionId, scenario2,  setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getSetForResponsibility set throws unknown object error if set is for different responsibility`()
    {
        val scenario2 = "scenario-2"
        val (setId, responsibilityId) = withDatabase {
            val returnedIds = setupDatabase(it)
            it.addScenarioDescription(scenario2, "Test scenario 2", diseaseId, addDisease = false)
            val responsibilityId = it.addResponsibility(returnedIds.responsibilitySetId, touchstoneVersionId, scenario2)
            val setId = it.addBurdenEstimateSet(responsibilityId, returnedIds.modelVersion!!, username, "complete")
            Pair(responsibilityId, setId)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateSetForResponsibility(setId, responsibilityId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getResponsibilityInfo throws unknown object error if touchstone does not exist`()
    {
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getResponsibilityInfo(groupId, touchstoneVersionId, scenarioId)
            }.isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("touchstone")
        }
    }

    @Test
    fun `getResponsibilityInfo throws unknown object error if scenario does not exist`()
    {
        withDatabase {
            it.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getResponsibilityInfo(groupId, touchstoneVersionId, scenarioId)
            }.isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("scenario")
        }
    }

    @Test
    fun `getResponsibilityInfo throws unknown object error if group is not responsible for scenario`()
    {
        withDatabase {
            it.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
            it.addScenarioDescription(scenarioId, "description", "disease", addDisease = true)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getResponsibilityInfo(groupId, touchstoneVersionId, scenarioId)
            }.isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @Test
    fun `can getBurdenEstimateOutcomesSequence`()
    {
        val setId = withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)
        }

        withDatabase{ db ->
            db.addCountries(listOf("ABC", "DEF"))
            db.addBurdenEstimate(setId, "DEF", 2001, 21, "cohort_size", 5f )
            db.addBurdenEstimate(setId, "ABC", 2000, 20, "deaths", 10f )
        }
        withRepo { repo ->
            val result = repo.getBurdenEstimateOutcomesSequence(groupId,
                    touchstoneVersionId, scenarioId, setId).toList()

            Assertions.assertThat(result.count()).isEqualTo(2)

            Assertions.assertThat(result[0].disease).isEqualTo("Hib3")
            Assertions.assertThat(result[0].year).isEqualTo(2000)
            Assertions.assertThat(result[0].age).isEqualTo(20)
            Assertions.assertThat(result[0].country).isEqualTo("ABC")
            Assertions.assertThat(result[0].countryName).isEqualTo("ABC-Name")
            Assertions.assertThat(result[0].burden_outcome_code).isEqualTo("deaths")
            Assertions.assertThat(result[0].value).isEqualTo(10f)

            Assertions.assertThat(result[1].disease).isEqualTo("Hib3")
            Assertions.assertThat(result[1].year).isEqualTo(2001)
            Assertions.assertThat(result[1].age).isEqualTo(21)
            Assertions.assertThat(result[1].country).isEqualTo("DEF")
            Assertions.assertThat(result[1].countryName).isEqualTo("DEF-Name")
            Assertions.assertThat(result[1].burden_outcome_code).isEqualTo("cohort_size")
            Assertions.assertThat(result[1].value).isEqualTo(5f)

        }


    }

    @Test
    fun `getBurdenEstimateOutcomesSequence returns only data for the requested burden estimate set`()
    {
        val setId = 25
        withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addCountries(listOf("ABC", "DEF"))

            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setId = setId)
            db.addBurdenEstimate(setId, "DEF", 2000, 15, "cohort_size", 1000f)

            setupSecondaryBurdenEstimates(db, modelVersionId, ids.responsibilitySetId)
        }
        withRepo { repo ->
            val result = repo.getBurdenEstimateOutcomesSequence(groupId,
                    touchstoneVersionId, scenarioId, setId).toList()

            Assertions.assertThat(result.count()).isEqualTo(1)

            Assertions.assertThat(result[0].disease).isEqualTo("Hib3")
            Assertions.assertThat(result[0].year).isEqualTo(2000)
            Assertions.assertThat(result[0].age).isEqualTo(15)
            Assertions.assertThat(result[0].country).isEqualTo("DEF")
            Assertions.assertThat(result[0].countryName).isEqualTo("DEF-Name")
            Assertions.assertThat(result[0].burden_outcome_code).isEqualTo("cohort_size")
            Assertions.assertThat(result[0].value).isEqualTo(1000f)
        }
    }

    @Test
    fun `getBurdenEstimateOutcomesSequence throws UnknownObjectError when burden estimate set does not belong to touchstone version`()
    {
        val setId = 25
        withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addCountries(listOf("ABC", "DEF"))

            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setId = setId)
            db.addBurdenEstimate(setId, "DEF", 2000, 15, "cohort_size", 1000f)

            //This creates the second touchstone version
            setupSecondaryBurdenEstimates(db, modelVersionId, ids.responsibilitySetId)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateOutcomesSequence(groupId,
                        "touchstone-2", scenarioId, setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getBurdenEstimateOutcomesSequence throws UnknownObjectError when touchstone version does not exist`()
    {
        val setId = 25
        withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addCountries(listOf("ABC", "DEF"))

            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setId = setId)
            db.addBurdenEstimate(setId, "DEF", 2000, 15, "cohort_size", 1000f)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateOutcomesSequence(groupId,
                        "nonexistent-1", scenarioId, setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getBurdenEstimateOutcomesSequence throws UnknownObjectError when burden estimate set does not belong to group`()
    {
        val setId = 25
        withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addCountries(listOf("ABC", "DEF"))

            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setId = setId)
            db.addBurdenEstimate(setId, "DEF", 2000, 15, "cohort_size", 1000f)

            //This creates the second group
            setupSecondaryBurdenEstimates(db, modelVersionId, ids.responsibilitySetId)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
               repo.getBurdenEstimateOutcomesSequence("group-2",
                        touchstoneVersionId, scenarioId, setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getBurdenEstimateOutcomesSequence throws UnknownObjectError when burden group does not exist`()
    {
        val setId = 25
        withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addCountries(listOf("ABC", "DEF"))

            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setId = setId)
            db.addBurdenEstimate(setId, "DEF", 2000, 15, "cohort_size", 1000f)

        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateOutcomesSequence("nonexistent-1",
                        touchstoneVersionId, scenarioId, setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getBurdenEstimateOutcomesSequence throws UnknownObjectError when burden estimate set does not belong to scenario`()
    {
        val setId = 25
        withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addCountries(listOf("ABC", "DEF"))

            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setId = setId)
            db.addBurdenEstimate(setId, "DEF", 2000, 15, "cohort_size", 1000f)

            //This creates the second scenario
            setupSecondaryBurdenEstimates(db, modelVersionId, ids.responsibilitySetId)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateOutcomesSequence(groupId,
                        touchstoneVersionId, "scenario-2", setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getBurdenEstimateOutcomesSequence throws UnknownObjectError when scenario does not exist`()
    {
        val setId = 25
        withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addCountries(listOf("ABC", "DEF"))

            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setId = setId)
            db.addBurdenEstimate(setId, "DEF", 2000, 15, "cohort_size", 1000f)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateOutcomesSequence(groupId,
                        touchstoneVersionId, "nonexistent-1", setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getBurdenEstimateOutcomesSequence throws UnknownObjectError when burden estimate set does not exist`()
    {
        val setId = 25
        withDatabase { db ->
            setupDatabase(db)
        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateOutcomesSequence(groupId,
                        touchstoneVersionId, scenarioId, setId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `getBurdenEstimateOutcomesSequence throws InvalidOperatioError when set is stochastic`()
    {
        val setId = 25
        withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addCountries(listOf("ABC", "DEF"))

            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setId = setId, setType = "stochastic")
            db.addBurdenEstimate(setId, "DEF", 2000, 15, "cohort_size", 1000f)

        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getBurdenEstimateOutcomesSequence(groupId,
                        touchstoneVersionId, scenarioId, setId)
            }.isInstanceOf(InvalidOperationError::class.java)
        }
    }

    @Test
    fun `can getExpectedOutcomesForBurdenEstimateSet`()
    {
        val setId = withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addExpectations(ids.responsibility, outcomes = listOf("cases", "deaths", "dalys"))
            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)
        }
        withRepo { repo ->
            val result = repo.getExpectedOutcomesForBurdenEstimateSet(setId)

            Assertions.assertThat(result.count()).isEqualTo(3)
            Assertions.assertThat(result[0]).isEqualTo("cases")
            Assertions.assertThat(result[1]).isEqualTo("dalys")
            Assertions.assertThat(result[2]).isEqualTo("deaths")
        }
    }

    @Test
    fun `getExpectedOutcomesForBurdenEstimateSet only returns expected outcomes for estimate set's responsibility`()
    {
        val setId = 25
        withDatabase { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addCountries(listOf("ABC"))
            db.addExpectations(ids.responsibility, outcomes = listOf("cases_acute"))
            db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username, setId = setId)

            //add secondary estimate sets and expectations
            setupSecondaryBurdenEstimates(db, modelVersionId, ids.responsibilitySetId)
        }
        withRepo { repo ->
            val result = repo.getExpectedOutcomesForBurdenEstimateSet(setId)

            Assertions.assertThat(result.count()).isEqualTo(1)
            Assertions.assertThat(result[0]).isEqualTo("cases_acute")
        }
    }

    private fun setupSecondaryBurdenEstimates(db: JooqContext, modelVersionId : Int, primaryResponsibilitySetId : Int)
    {
        //For testing that correct burden estimate values are returned, create
        // additional  burden estimate sets, for a second touchstone, group and scenario
        val secondTouchstoneVersionId = "touchstone-2"
        val secondModellingGroupId = "group-2"
        val secondScenarioId = "scenario-2"
        db.addTouchstoneVersion("touchstone", 2, "Touchstone 2", addTouchstone = false)

        //Add a second modelling group
        db.addGroup(secondModellingGroupId)

        //Add a second scenario
        db.addScenarioDescription(secondScenarioId, "description", "Hib3")


        val secondTouchstoneResponsibilitySetId = db.addResponsibilitySet(groupId, secondTouchstoneVersionId)
        val secondTouchstoneResponsibilityId = db.addResponsibility(secondTouchstoneResponsibilitySetId,
                secondTouchstoneVersionId, scenarioId)
        val secondTouchstoneBurdenEstimateSetId = 99
        db.addBurdenEstimateSet(secondTouchstoneResponsibilityId, modelVersionId, username, setId = secondTouchstoneBurdenEstimateSetId)
        db.addBurdenEstimate(secondTouchstoneBurdenEstimateSetId, "ABC", 1960, 65, "deaths", 27f )
        db.addExpectations(secondTouchstoneResponsibilityId, outcomes = listOf("cases", "deaths", "dalys"))

        val secondGroupResponsibilitySetId = db.addResponsibilitySet(secondModellingGroupId, touchstoneVersionId)
        val secondGroupResponsibilityId = db.addResponsibility(secondGroupResponsibilitySetId, touchstoneVersionId, scenarioId)
        val secondGroupBurdenEstimateSetId = 199
        db.addBurdenEstimateSet(secondGroupResponsibilityId, modelVersionId, username, setId = secondGroupBurdenEstimateSetId)
        db.addBurdenEstimate(secondGroupBurdenEstimateSetId, "ABC", 1961, 61, "cases", 77f )
        db.addExpectations(secondGroupResponsibilityId, outcomes = listOf("cases", "deaths", "dalys"))

        val secondScenarioResponsibilityId = db.addResponsibility(primaryResponsibilitySetId, touchstoneVersionId, secondScenarioId)
        val secondScenarioBurdenEstimateSetId = 299
        db.addBurdenEstimateSet(secondScenarioResponsibilityId, modelVersionId, username, setId = secondScenarioBurdenEstimateSetId)
        db.addBurdenEstimate(secondScenarioBurdenEstimateSetId, "ABC", 1962, 62, "dalys", 87f )
        db.addExpectations(secondGroupResponsibilityId, outcomes = listOf("cases", "deaths", "dalys"))
    }

    private fun checkSetHasExpectedType(sets: List<BurdenEstimateSet>, setId: Int, expectedType: BurdenEstimateSetType)
    {
        val set = sets.singleOrNull { it.id == setId }
        assertThat(set?.type).isEqualTo(expectedType)
    }

    private fun addBurdenEstimateSet(
            db: JooqContext, ids: ReturnedIds, username: String? = null,
            setType: String = "central-single-run", setTypeDetails: String? = null
    ): Int
    {
        return db.addBurdenEstimateSet(
                ids.responsibility,
                ids.modelVersion!!,
                username ?: this.username,
                setType = setType, setTypeDetails = setTypeDetails
        )
    }
}