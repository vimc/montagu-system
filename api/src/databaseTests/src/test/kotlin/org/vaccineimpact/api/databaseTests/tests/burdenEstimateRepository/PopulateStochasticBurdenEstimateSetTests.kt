package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.jooq.Record
import org.jooq.Result
import org.junit.Test
import org.vaccineimpact.api.app.errors.*
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet
import org.vaccineimpact.api.db.direct.addModelRun
import org.vaccineimpact.api.db.direct.addModelRunParameterSet
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import org.vaccineimpact.api.models.BurdenEstimateWithRunId
import org.vaccineimpact.api.models.CreateBurdenEstimateSet
import java.math.BigDecimal

class PopulateStochasticBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can populate stochastic burden estimate set`()
    {
        val (returnedIds, modelRunData) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            Pair(returnedIds, modelRunData)
        }
        val setId = withRepo { repo ->
            val properties = defaultProperties.copy(BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC),
                    modelRunData.runParameterSetId)
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, properties, username, timestamp)
            val data = data(modelRunData.externalIds)
            repo.populateStochasticBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
            setId
        }
        withDatabase { db ->
            checkBurdenEstimates(db, setId)
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "partial")
        }
    }

    @Test
    fun `cannot populate a stochastic set if status is complete`()
    {
        val (setId, modelRunData) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)

            Pair(db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, "complete", "stochastic", null, modelRunData.runParameterSetId), modelRunData)
        }
        withRepo { repo ->

            val data = data(modelRunData.externalIds)

            assertThatThrownBy {
                repo.populateStochasticBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
            }.isInstanceOf(OperationNotAllowedError::class.java)
                    .hasMessage("the following problems occurred:\nThis burden estimate set is marked as complete." +
                            " You must create a new set if you want to upload any new estimates.")
        }
    }

    @Test
    fun `can populate a stochastic set if status is partial`()
    {
        val (setId, modelRunData, returnedIds) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)

            Triple(db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, "partial", "stochastic", null, modelRunData.runParameterSetId, timestamp), modelRunData, returnedIds)
        }
        withRepo { repo ->
            val data = data(modelRunData.externalIds)
            repo.populateStochasticBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
        }
        withDatabase { db ->
            checkBurdenEstimates(db, setId)
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "partial")
        }
    }

    @Test
    fun `populate stochastic set throws unknown object error if set does not exist`()
    {
        JooqContext().use {
            setupDatabase(it)
            val repo = makeRepository(it)
            assertThatThrownBy {
                repo.populateStochasticBurdenEstimateSet(12, groupId, touchstoneId, scenarioId, data())
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `cannot create burden estimates with diseases that do not match scenario`()
    {
        val badData = data().map { it.copy(disease = "YF") }
        JooqContext().use { db ->
            setupDatabase(db)
            val repo = makeRepository(db)
            assertThatThrownBy {
                val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, badData)
            }.isInstanceOf(InconsistentDataError::class.java)
        }
    }

    @Test
    fun `cannot populate burden estimates with non-existent countries`()
    {
        val badData = data().map { it.copy(country = "FAKE") }
        JooqContext().use { db ->
            setupDatabase(db)
            val repo = makeRepository(db)
            assertThatThrownBy {
                val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, badData)
            }.isInstanceOf(UnknownObjectError::class.java).matches {
                (it as UnknownObjectError).typeName == "country"
            }
        }
    }

    @Test
    fun `cannot populate burden estimate set if cohort_size is missing from burden_outcome table`()
    {
        JooqContext().use { db ->
            setupDatabase(db)
            db.dsl.deleteFrom(BURDEN_OUTCOME).where(BURDEN_OUTCOME.CODE.eq("cohort_size")).execute()
            val repo = makeRepository(db)
            assertThatThrownBy {
                val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data())
            }.isInstanceOf(DatabaseContentsError::class.java)
        }
    }

    @Test
    fun `populate set throws error if run ID is unknown`()
    {
        val modelRunData = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            modelRunData
        }
        withRepo { repo ->
            val properties = defaultProperties.copy(modelRunParameterSetId = modelRunData.runParameterSetId)
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, properties, username, timestamp)
            val data = data(listOf("bad-id-1", "bad-id-2"))
            assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
            }.isInstanceOf(UnknownRunIdError::class.java)
        }
    }

    @Test
    fun `populate set throws error if run ID is specified but model run parameter set is not`()
    {
        val modelRunData = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            modelRunData
        }
        withRepo { repo ->
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
            val data = data(modelRunData.externalIds)
            assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
            }.isInstanceOf(UnknownRunIdError::class.java)
        }
    }

    private fun checkBurdenEstimates(db: JooqContext, setId: Int)
    {
        val records = getEstimatesInOrder(db)
        checkRecord(records[0], setId, 2000, 50, "AFG", "cases", 100.toDecimal())
        checkRecord(records[1], setId, 2000, 50, "AFG", "cohort_size", 1000.toDecimal())
        checkRecord(records[2], setId, 2000, 50, "AFG", "deaths", 10.toDecimal())
        checkRecord(records[3], setId, 1980, 30, "AGO", "cohort_size", 2000.toDecimal())
        checkRecord(records[4], setId, 1980, 30, "AGO", "dalys", 73.6.toDecimal())
        checkRecord(records[5], setId, 1980, 30, "AGO", "deaths", 20.toDecimal())
    }

    private fun checkModelRuns(db: JooqContext, modelRunData: ModelRunTestData)
    {
        val records = getEstimatesInOrder(db)
        val expectedIds = modelRunData.internalIds
        for (i in 0..2)
        {
            assertThat(records[i][BURDEN_ESTIMATE.MODEL_RUN]).isEqualTo(expectedIds[0])
        }
        for (i in 3..5)
        {
            assertThat(records[i][BURDEN_ESTIMATE.MODEL_RUN]).isEqualTo(expectedIds[1])
        }
    }

    private fun getEstimatesInOrder(db: JooqContext): Result<Record>
    {
        // We order the rows coming back so they are in a guaranteed order. This allows
        // us to write simple hardcoded expectations.
        val t = BURDEN_ESTIMATE_STOCHASTIC
        return db.dsl.select(t.BURDEN_ESTIMATE_SET, t.COUNTRY, t.YEAR, t.AGE, t.VALUE, t.MODEL_RUN)
                .select(BURDEN_OUTCOME.CODE)
                .from(BURDEN_ESTIMATE_STOCHASTIC)
                .join(BURDEN_OUTCOME)
                .on(BURDEN_OUTCOME.ID.eq(BURDEN_ESTIMATE_STOCHASTIC.BURDEN_OUTCOME))
                .orderBy(BURDEN_ESTIMATE_STOCHASTIC.COUNTRY, BURDEN_OUTCOME.CODE)
                .fetch()
    }

    private fun checkRecord(record: Record, setId: Int,
                            year: Int, age: Int, country: String, outcomeCode: String, outcomeValue: BigDecimal)
    {
        val t = BURDEN_ESTIMATE_STOCHASTIC
        assertThat(record[t.BURDEN_ESTIMATE_SET]).isEqualTo(setId)
        assertThat(record[t.COUNTRY]).isEqualTo(country)
        assertThat(record[t.YEAR]).isEqualTo(year)
        assertThat(record[t.AGE]).isEqualTo(age)
        assertThat(record[BURDEN_OUTCOME.CODE]).isEqualTo(outcomeCode)
        assertThat(record[t.VALUE]).isEqualTo(outcomeValue)
    }

    private fun data(runs: List<String?> = listOf(null, null)) = sequenceOf(
            BurdenEstimateWithRunId(disease, runs[0], 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                    "deaths" to 10.toDecimal(),
                    "cases" to 100.toDecimal()
            )),
            BurdenEstimateWithRunId(disease, runs[1], 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                    "deaths" to 20.toDecimal(),
                    "dalys" to 73.6.toDecimal()
            ))
    )

    private fun addModelRuns(db: JooqContext, responsibilitySetId: Int, modelVersionId: Int): ModelRunTestData
    {
        val runs = listOf("marathon", "sprint")
        val runParameterSetId = db.addModelRunParameterSet(responsibilitySetId, modelVersionId, username, "Test")
        return ModelRunTestData(runParameterSetId, runs.map { runId ->
            runId to db.addModelRun(runParameterSetId, runId)
        })
    }

    private val defaultProperties = CreateBurdenEstimateSet(
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC),
            modelRunParameterSetId = null
    )

    data class ModelRunTestData(val runParameterSetId: Int, val runs: List<Pair<String, Int>>)
    {
        val externalIds = runs.map { (runId, _) -> runId }
        val internalIds = runs.map { (_, internalId) -> internalId }
    }
}