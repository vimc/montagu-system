package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.jooq.Record
import org.junit.Test
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.OperationNotAllowedError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.jooq.*
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.BurdenEstimate
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.Month
import java.time.ZoneOffset

class BurdenEstimateRepositoryTests : RepositoryTests<BurdenEstimateRepository>()
{
    private data class ReturnedIds(val modelVersion: Int?, val responsibility: Int)

    override fun makeRepository(db: JooqContext): BurdenEstimateRepository
    {
        val scenario = JooqScenarioRepository(db.dsl)
        val touchstone = JooqTouchstoneRepository(db.dsl, scenario)

        val modellingGroup = JooqModellingGroupRepository(db.dsl, touchstone, scenario)
        return JooqBurdenEstimateRepository(db.dsl, scenario, touchstone, modellingGroup)
    }

    private val scenarioId = "scenario-1"
    private val groupId = "group-1"
    private val touchstoneId = "touchstone-1"
    private val modelId = "model-1"
    private val modelVersion = "version-1"
    private val username = "some.user"
    private val timestamp = LocalDateTime.of(2017, Month.JUNE, 13, 12, 30).toInstant(ZoneOffset.UTC)

    @Test
    fun `can add burden estimate set`()
    {
        var returnedIds: ReturnedIds? = null

        given { db ->
            returnedIds = setupDatabase(db)
        } makeTheseChanges { repo ->
            repo.addBurdenEstimateSet(groupId, touchstoneId, scenarioId, data, username, timestamp)
        } andCheckDatabase { db ->
            val setId = checkBurdenEstimateSetMetadata(db, returnedIds!!)
            checkBurdenEstimates(db, setId)
        }
    }

    @Test
    fun `updates responsibility current estimate set`()
    {
        var returnedIds: ReturnedIds? = null
        var setId: Int? = null
        given { db ->
            returnedIds = setupDatabase(db)
        } makeTheseChanges { repo ->
            setId = repo.addBurdenEstimateSet(groupId, touchstoneId, scenarioId, data, username, timestamp)
        } andCheckDatabase { db ->
            checkCurrentBurdenEstimateSet(db, returnedIds!!, setId!!)
        }
    }

    @Test
    fun `cannot add burden estimates with diseases that do not match scenario`()
    {
        val badData = data.map { it.copy(disease = "YF") }
        JooqContext().use { db ->
            setupDatabase(db)
            val repo = makeRepository(db)
            assertThatThrownBy {
                repo.addBurdenEstimateSet(groupId, touchstoneId, scenarioId, badData, username, timestamp)
            }.isInstanceOf(InconsistentDataError::class.java)
        }
    }

    @Test
    fun `cannot add burden estimate set if group has no model`()
    {
        JooqContext().use { db ->
            setupDatabase(db, addModel = false)
            val repo = makeRepository(db)
            assertThatThrownBy {
                repo.addBurdenEstimateSet(groupId, touchstoneId, scenarioId, data, username, timestamp)
            }.isInstanceOf(DatabaseContentsError::class.java)
        }
    }

    @Test
    fun `cannot add burden estimate set if cohort_size is missing from burden_outcome table`()
    {
        JooqContext().use { db ->
            setupDatabase(db)
            db.dsl.deleteFrom(BURDEN_OUTCOME).where(BURDEN_OUTCOME.CODE.eq("cohort_size")).execute()
            val repo = makeRepository(db)
            assertThatThrownBy {
                repo.addBurdenEstimateSet(groupId, touchstoneId, scenarioId, data, username, timestamp)
            }.isInstanceOf(DatabaseContentsError::class.java)
        }
    }

    @Test
    fun `cannot add burden estimate set if responsibility set status is submitted`()
    {
        JooqContext().use { db ->
            setupDatabase(db, responsibilitySetStatus = "submitted")
            val repo = makeRepository(db)
            assertThatThrownBy {
                repo.addBurdenEstimateSet(groupId, touchstoneId, scenarioId, data, username, timestamp)
            }.isInstanceOf(OperationNotAllowedError::class.java)
                    .hasMessage("the following problems occurred:\nThe burden estimates uploaded for this touchstone have been submitted for review." +
                            " You cannot upload any new estimates.")
        }
    }

    @Test
    fun `cannot add burden estimate set if responsibility set status is approved`()
    {
        JooqContext().use { db ->
            setupDatabase(db, responsibilitySetStatus = "approved")
            val repo = makeRepository(db)
            assertThatThrownBy {
                repo.addBurdenEstimateSet(groupId, touchstoneId, scenarioId, data, username, timestamp)
            }.isInstanceOf(OperationNotAllowedError::class.java)
                    .hasMessage("the following problems occurred:\nThe burden estimates uploaded for this touchstone have been reviewed and approved." +
                            " You cannot upload any new estimates.")
        }
    }

    @Test
    fun `cannot add burden estimate set if touchstone doesn't exist`()
    {
        checkBadId(otherTouchstoneId = "wrong-id")
    }

    @Test
    fun `cannot add burden estimate set if group doesn't exist`()
    {
        checkBadId(otherGroupId = "wrong-id")
    }

    @Test
    fun `cannot add burden estimate set if scenario doesn't exist`()
    {
        checkBadId(otherScenarioId = "wrong-id")
    }

    private fun checkBadId(
            otherGroupId: String = groupId,
            otherTouchstoneId: String = touchstoneId,
            otherScenarioId: String = scenarioId)
    {
        JooqContext().use { db ->
            setupDatabase(db)
            val repo = makeRepository(db)
            assertThatThrownBy {
                repo.addBurdenEstimateSet(otherGroupId, otherTouchstoneId, otherScenarioId, data, username, timestamp)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    private fun setupDatabase(db: JooqContext, addModel: Boolean = true,
                              responsibilitySetStatus: String = "incomplete"): ReturnedIds
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
        db.addGroup(groupId, "Test group")
        val modelVersionId = if (addModel)
        {
            db.addModel(modelId, groupId, "Hib3")
            db.addModelVersion(modelId, modelVersion, setCurrent = true)
        }
        else
        {
            null
        }
        val setId = db.addResponsibilitySet(groupId, touchstoneId, responsibilitySetStatus)
        val responsibilityId = db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addUserForTesting(username)
        return ReturnedIds(modelVersionId, responsibilityId)
    }

    private fun checkBurdenEstimates(db: JooqContext, setId: Int)
    {
        // We order the rows coming back so they are in a guaranteed order. This allows
        // us to write simple hardcoded expectations.
        val t = BURDEN_ESTIMATE
        val records = db.dsl.select(t.BURDEN_ESTIMATE_SET, t.COUNTRY, t.YEAR, t.AGE, t.VALUE, t.STOCHASTIC)
                .select(BURDEN_OUTCOME.CODE)
                .fromJoinPath(BURDEN_ESTIMATE, BURDEN_OUTCOME)
                .orderBy(BURDEN_ESTIMATE.COUNTRY, BURDEN_OUTCOME.CODE)
                .fetch()

        checkRecord(records[0], setId, 2000, 50, "AFG", "cases", 100.toDecimal())
        checkRecord(records[1], setId, 2000, 50, "AFG", "cohort_size", 1000.toDecimal())
        checkRecord(records[2], setId, 2000, 50, "AFG", "deaths", 10.toDecimal())
        checkRecord(records[3], setId, 1980, 30, "AGO", "cohort_size", 2000.toDecimal())
        checkRecord(records[4], setId, 1980, 30, "AGO", "dalys", 73.6.toDecimal())
        checkRecord(records[5], setId, 1980, 30, "AGO", "deaths", 20.toDecimal())
    }

    private fun checkBurdenEstimateSetMetadata(db: JooqContext, returnedIds: ReturnedIds): Int
    {
        val t = BURDEN_ESTIMATE_SET
        val set = db.dsl.fetchOne(t)
        assertThat(set[t.MODEL_VERSION]).isEqualTo(returnedIds.modelVersion!!)
        assertThat(set[t.RESPONSIBILITY]).isEqualTo(returnedIds.responsibility)
        assertThat(set[t.UPLOADED_BY]).isEqualTo(username)
        assertThat(set[t.UPLOADED_ON].toInstant()).isEqualTo(timestamp)
        return set[t.ID]
    }

    private fun checkCurrentBurdenEstimateSet(db: JooqContext, returnedIds: ReturnedIds, setId: Int)
    {
        val actualSetId = db.dsl.select(RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET)
                .from(RESPONSIBILITY)
                .where(RESPONSIBILITY.ID.eq(returnedIds.responsibility))
                .fetchOneInto(Int::class.java)

        assertThat(actualSetId).isEqualTo(setId)
    }

    private fun checkRecord(record: Record, setId: Int,
                            year: Int, age: Int, country: String, outcomeCode: String, outcomeValue: BigDecimal)
    {
        val t = BURDEN_ESTIMATE
        assertThat(record[t.BURDEN_ESTIMATE_SET]).isEqualTo(setId)
        assertThat(record[t.COUNTRY]).isEqualTo(country)
        assertThat(record[t.YEAR]).isEqualTo(year)
        assertThat(record[t.AGE]).isEqualTo(age)
        assertThat(record[t.STOCHASTIC]).isFalse()
        assertThat(record[BURDEN_OUTCOME.CODE]).isEqualTo(outcomeCode)
        assertThat(record[t.VALUE]).isEqualTo(outcomeValue)
    }

    private val data = listOf(
            BurdenEstimate("Hib3", 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                    "deaths" to 10.toDecimal(),
                    "cases" to 100.toDecimal()
            )),
            BurdenEstimate("Hib3", 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                    "deaths" to 20.toDecimal(),
                    "dalys" to 73.6.toDecimal()
            ))
    )
}