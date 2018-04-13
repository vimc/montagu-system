package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions
import org.jooq.Record
import org.jooq.Result
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.burdenestimates.CentralBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.StochasticBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.JooqBurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.mapping.BurdenMappingHelper
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.*
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.Month
import java.time.ZoneOffset

abstract class BurdenEstimateRepositoryTests : RepositoryTests<BurdenEstimateRepository>()
{
    protected data class ReturnedIds(val modelVersion: Int?, val responsibility: Int, val responsibilitySetId: Int)

    override fun makeRepository(db: JooqContext): BurdenEstimateRepository
    {
        val scenario = JooqScenarioRepository(db.dsl)
        val touchstone = JooqTouchstoneRepository(db.dsl, scenario)

        val modellingGroup = JooqModellingGroupRepository(db.dsl, touchstone, scenario)
        return JooqBurdenEstimateRepository(db.dsl, scenario, touchstone, modellingGroup)
    }

    protected fun makeRepository(
            db: JooqContext,
            centralEstimateWriter: CentralBurdenEstimateWriter,
            stochasticBurdenEstimateWriter: StochasticBurdenEstimateWriter
    ): JooqBurdenEstimateRepository
    {
        val scenario = JooqScenarioRepository(db.dsl)
        val touchstone = JooqTouchstoneRepository(db.dsl, scenario)

        val modellingGroup = JooqModellingGroupRepository(db.dsl, touchstone, scenario)
        return JooqBurdenEstimateRepository(db.dsl, scenario, touchstone, modellingGroup, BurdenMappingHelper(),
                centralEstimateWriter, stochasticBurdenEstimateWriter)
    }

    protected val scenarioId = "scenario-1"
    protected val groupId = "group-1"
    protected val touchstoneId = "touchstone-1"
    protected val modelId = "model-1"
    protected val modelVersion = "version-1"
    protected val username = "some.user"
    protected val timestamp = LocalDateTime.of(2017, Month.JUNE, 13, 12, 30).toInstant(ZoneOffset.UTC)
    protected val diseaseId = "Hib3"
    protected val diseaseName = "Hib3 Name"

    protected fun setupDatabase(db: JooqContext, addModel: Boolean = true,
                                responsibilitySetStatus: String = "incomplete"): ReturnedIds
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addDisease(diseaseId, diseaseName)
        db.addScenarioDescription(scenarioId, "Test scenario", diseaseId, addDisease = false)
        db.addGroup(groupId, "Test group")
        val modelVersionId = if (addModel)
        {
            db.addModel(modelId, groupId, diseaseId)
            db.addModelVersion(modelId, modelVersion, setCurrent = true)
        }
        else
        {
            null
        }
        val setId = db.addResponsibilitySet(groupId, touchstoneId, responsibilitySetStatus)
        val responsibilityId = db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addUserForTesting(username)
        return ReturnedIds(modelVersionId, responsibilityId, setId)
    }

    protected fun setupDatabaseWithBurdenEstimateSet(
            db: JooqContext,
            status: String = "empty",
            type: String = "central-single-run"
    ): Int
    {
        val ids = setupDatabase(db)
        return db.addBurdenEstimateSet(ids.responsibility, ids.modelVersion!!, username,
                status = status, setType = type)
    }

    protected fun setupDatabaseWithModelRunParameterSet(db: JooqContext,
                                                        responsibilitySetStatus: String = "incomplete"): ReturnedIds
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
        db.addGroup(groupId, "Test group")

        db.addModel(modelId, groupId, diseaseId)
        val modelVersionId = db.addModelVersion(modelId, modelVersion, setCurrent = true)

        val setId = db.addResponsibilitySet(groupId, touchstoneId, responsibilitySetStatus)
        val responsibilityId = db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addUserForTesting(username)

        db.addModelRunParameterSet(setId, modelVersionId, username)

        return ReturnedIds(modelVersionId, responsibilityId, setId)
    }

    protected fun setupDatabaseWithModelRunParameterSetValues(db: JooqContext)
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
        db.addGroup(groupId, "Test group")

        db.addModel(modelId, groupId, diseaseId)
        val modelVersionId = db.addModelVersion(modelId, modelVersion, setCurrent = true)

        val setId = db.addResponsibilitySet(groupId, touchstoneId, "incomplete")
        db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addUserForTesting(username)

        val paramsSetId = db.addModelRunParameterSet(setId, modelVersionId, username)
        val modelRunId = db.addModelRun(paramsSetId, "1")
        val modelRunId2 = db.addModelRun(paramsSetId, "2")
        val modelRunParameterId1 = db.addModelRunParameter(paramsSetId, "<param_1>")
        val modelRunParameterId2 = db.addModelRunParameter(paramsSetId, "<param_2>")
        db.addModelRunParameterValue(modelRunId, modelRunParameterId1, "aa")
        db.addModelRunParameterValue(modelRunId, modelRunParameterId2, "bb")
        db.addModelRunParameterValue(modelRunId2, modelRunParameterId1, "cc")
        db.addModelRunParameterValue(modelRunId2, modelRunParameterId2, "dd")
    }

    protected fun checkBurdenEstimateSetMetadata(db: JooqContext,
                                                 setId: Int,
                                                 returnedIds: ReturnedIds,
                                                 expectedStatus: String)
            : Int
    {
        val t = Tables.BURDEN_ESTIMATE_SET
        val set = db.dsl.selectFrom(t).where(t.ID.eq(setId)).fetchOne()
        Assertions.assertThat(set[t.MODEL_VERSION]).isEqualTo(returnedIds.modelVersion!!)
        Assertions.assertThat(set[t.RESPONSIBILITY]).isEqualTo(returnedIds.responsibility)
        Assertions.assertThat(set[t.UPLOADED_BY]).isEqualTo(username)
        Assertions.assertThat(set[t.UPLOADED_ON].toInstant()).isEqualTo(timestamp)
        Assertions.assertThat(set[t.STATUS]).isEqualTo(expectedStatus)
        return set[t.ID]
    }


    protected fun checkBurdenEstimates(db: JooqContext, setId: Int)
    {
        val records = getEstimatesInOrder(db)
        checkRecord(records[0], setId, 2000, 50, "AFG", "cases", 100.toDecimal())
        checkRecord(records[1], setId, 2000, 50, "AFG", "cohort_size", 1000.toDecimal())
        checkRecord(records[2], setId, 2000, 50, "AFG", "deaths", 10.toDecimal())
        checkRecord(records[3], setId, 1980, 30, "AGO", "cohort_size", 2000.toDecimal())
        checkRecord(records[4], setId, 1980, 30, "AGO", "dalys", 73.6.toDecimal())
        checkRecord(records[5], setId, 1980, 30, "AGO", "deaths", 20.toDecimal())
    }

    protected fun checkModelRuns(db: JooqContext, modelRunData: ModelRunTestData)
    {
        val records = getEstimatesInOrder(db)
        val expectedIds = modelRunData.internalIds
        for (i in 0..2)
        {
            Assertions.assertThat(records[i][Tables.BURDEN_ESTIMATE.MODEL_RUN]).isEqualTo(expectedIds[0])
        }
        for (i in 3..5)
        {
            Assertions.assertThat(records[i][Tables.BURDEN_ESTIMATE.MODEL_RUN]).isEqualTo(expectedIds[1])
        }
    }

    protected fun getEstimatesInOrder(db: JooqContext): Result<Record>
    {
        // We order the rows coming back so they are in a guaranteed order. This allows
        // us to write simple hardcoded expectations.
        val t = Tables.BURDEN_ESTIMATE
        return db.dsl.select(t.BURDEN_ESTIMATE_SET, t.YEAR, t.AGE, t.VALUE, t.MODEL_RUN)
                .select(Tables.BURDEN_OUTCOME.CODE)
                .select(Tables.COUNTRY.ID)
                .fromJoinPath(Tables.BURDEN_ESTIMATE, Tables.BURDEN_OUTCOME)
                .join(Tables.COUNTRY).on(Tables.BURDEN_ESTIMATE.COUNTRY.eq(Tables.COUNTRY.NID))
                .orderBy(Tables.BURDEN_ESTIMATE.COUNTRY, Tables.BURDEN_OUTCOME.CODE)
                .fetch()
    }

    private fun checkRecord(record: Record, setId: Int,
                            year: Short, age: Short, country: String, outcomeCode: String, outcomeValue: BigDecimal)
    {
        val t = Tables.BURDEN_ESTIMATE
        Assertions.assertThat(record[t.BURDEN_ESTIMATE_SET]).isEqualTo(setId)
        Assertions.assertThat(record[Tables.COUNTRY.ID]).isEqualTo(country)
        Assertions.assertThat(record[t.YEAR]).isEqualTo(year)
        Assertions.assertThat(record[t.AGE]).isEqualTo(age)
        Assertions.assertThat(record[Tables.BURDEN_OUTCOME.CODE]).isEqualTo(outcomeCode)
        Assertions.assertThat(record[t.VALUE]).isEqualTo(outcomeValue)
    }

    protected fun data(runs: List<String?> = listOf(null, null)) = sequenceOf(
            BurdenEstimateWithRunId(diseaseId, runs[0], 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                    "deaths" to 10.toDecimal(),
                    "cases" to 100.toDecimal()
            )),
            BurdenEstimateWithRunId(diseaseId, runs[1], 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                    "deaths" to 20.toDecimal(),
                    "dalys" to 73.6.toDecimal()
            ))
    )

    protected fun addModelRuns(db: JooqContext, responsibilitySetId: Int, modelVersionId: Int): ModelRunTestData
    {
        val runs = listOf("marathon", "sprint")
        val runParameterSetId = db.addModelRunParameterSet(responsibilitySetId, modelVersionId, username)
        return ModelRunTestData(runParameterSetId, runs.map { runId ->
            runId to db.addModelRun(runParameterSetId, runId)
        })
    }

    protected val defaultProperties = CreateBurdenEstimateSet(
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_UNKNOWN),
            modelRunParameterSet = null
    )


    protected fun checkStochasticBurdenEstimates(db: JooqContext, setId: Int)
    {
        val records = getStochasticEstimatesInOrder(db)
        checkStochasticRecord(records[0], setId, 2000, 50, "AFG", "cases", 100.toDecimal())
        checkStochasticRecord(records[1], setId, 2000, 50, "AFG", "cohort_size", 1000.toDecimal())
        checkStochasticRecord(records[2], setId, 2000, 50, "AFG", "deaths", 10.toDecimal())
        checkStochasticRecord(records[3], setId, 1980, 30, "AGO", "cohort_size", 2000.toDecimal())
        checkStochasticRecord(records[4], setId, 1980, 30, "AGO", "dalys", 73.6.toDecimal())
        checkStochasticRecord(records[5], setId, 1980, 30, "AGO", "deaths", 20.toDecimal())
    }

    protected fun checkStochasticModelRuns(db: JooqContext, modelRunData: ModelRunTestData)
    {
        val records = getStochasticEstimatesInOrder(db)
        val expectedIds = modelRunData.internalIds
        for (i in 0..2)
        {
            Assertions.assertThat(records[i][Tables.BURDEN_ESTIMATE.MODEL_RUN]).isEqualTo(expectedIds[0])
        }
        for (i in 3..5)
        {
            Assertions.assertThat(records[i][Tables.BURDEN_ESTIMATE.MODEL_RUN]).isEqualTo(expectedIds[1])
        }
    }

    protected fun getStochasticEstimatesInOrder(db: JooqContext): Result<Record>
    {
        // We order the rows coming back so they are in a guaranteed order. This allows
        // us to write simple hardcoded expectations.
        val t = Tables.BURDEN_ESTIMATE_STOCHASTIC
        return db.dsl.select(t.BURDEN_ESTIMATE_SET, t.YEAR, t.AGE, t.VALUE, t.MODEL_RUN)
                .select(Tables.BURDEN_OUTCOME.CODE)
                .select(Tables.COUNTRY.ID)
                .from(Tables.BURDEN_ESTIMATE_STOCHASTIC)
                .join(Tables.BURDEN_OUTCOME)
                .on(Tables.BURDEN_OUTCOME.ID.eq(Tables.BURDEN_ESTIMATE_STOCHASTIC.BURDEN_OUTCOME))
                .join(Tables.COUNTRY).on(t.COUNTRY.eq(Tables.COUNTRY.NID))
                .orderBy(Tables.BURDEN_ESTIMATE_STOCHASTIC.COUNTRY, Tables.BURDEN_OUTCOME.CODE)
                .fetch()
    }

    protected fun checkStochasticRecord(
            record: Record, setId: Int,
            year: Short, age: Short, country: String,
            outcomeCode: String, outcomeValue: BigDecimal
    )
    {
        val t = Tables.BURDEN_ESTIMATE_STOCHASTIC
        Assertions.assertThat(record[t.BURDEN_ESTIMATE_SET]).isEqualTo(setId)
        Assertions.assertThat(record[Tables.COUNTRY.ID]).isEqualTo(country)
        Assertions.assertThat(record[t.YEAR]).isEqualTo(year)
        Assertions.assertThat(record[t.AGE]).isEqualTo(age)
        Assertions.assertThat(record[Tables.BURDEN_OUTCOME.CODE]).isEqualTo(outcomeCode)
        Assertions.assertThat(record[t.VALUE]).isEqualTo(outcomeValue)
    }

    protected val defaultStochasticProperties = CreateBurdenEstimateSet(
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC),
            modelRunParameterSet = null
    )

    data class ModelRunTestData(val runParameterSetId: Int, val runs: List<Pair<String, Int>>)
    {
        val externalIds = runs.map { (runId, _) -> runId }
        val internalIds = runs.map { (_, internalId) -> internalId }
    }
}