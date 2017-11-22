package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.JoinType
import org.postgresql.copy.CopyManager
import org.postgresql.core.BaseConnection
import org.vaccineimpact.api.app.errors.*
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.mapping.BurdenMappingHelper
import org.vaccineimpact.api.db.*
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.models.*
import java.beans.ConstructorProperties
import java.io.*
import java.math.BigDecimal
import java.sql.Connection
import java.sql.Timestamp
import java.time.Instant
import kotlin.concurrent.thread

private data class ResponsibilityInfo
@ConstructorProperties("id", "disease", "status")
constructor(val id: Int, val disease: String, val setStatus: String)

class JooqBurdenEstimateRepository(
        dsl: DSLContext,
        private val scenarioRepository: ScenarioRepository,
        override val touchstoneRepository: TouchstoneRepository,
        private val modellingGroupRepository: ModellingGroupRepository,
        private val mapper: BurdenMappingHelper = BurdenMappingHelper()
) : JooqRepository(dsl), BurdenEstimateRepository
{
    override fun getBurdenEstimateSets(groupId: String, touchstoneId: String, scenarioId: String): List<BurdenEstimateSet>
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)
        val table = BURDEN_ESTIMATE_SET
        val records = dsl.select(
                table.ID,
                table.UPLOADED_ON,
                table.UPLOADED_BY,
                table.SET_TYPE,
                table.SET_TYPE_DETAILS,
                BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM
        )
                .from(table)
                .joinPath(table, BURDEN_ESTIMATE_SET_PROBLEM, joinType = JoinType.LEFT_OUTER_JOIN)
                .join(RESPONSIBILITY).on(RESPONSIBILITY.ID.eq(table.RESPONSIBILITY))
                .joinPath(RESPONSIBILITY, RESPONSIBILITY_SET, MODELLING_GROUP)
                .joinPath(RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneId))
                .and(MODELLING_GROUP.ID.eq(modellingGroup.id))
                .fetch()

        return records
                .groupBy { it[table.ID] }
                .map { group ->
                    val common = group.value.first()
                    val problems = group.value.mapNotNull { it[BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM] }
                    BurdenEstimateSet(
                            common[table.ID],
                            common[table.UPLOADED_ON].toInstant(),
                            common[table.UPLOADED_BY],
                            mapper.mapBurdenEstimateSetType(common),
                            problems
                    )
                }
    }

    override fun addModelRunParameterSet(responsibilitySetId: Int, modelVersionId: Int,
                                         description: String, modelRuns: List<ModelRun>,
                                         uploader: String, timestamp: Instant)
    {
        val uploadInfoId = addUploadInfo(uploader, timestamp)
        val parameterSetId = addParameterSet(responsibilitySetId, modelVersionId, description, uploadInfoId)
        val parameterLookup = addParameters(modelRuns, parameterSetId)

        for (run in modelRuns)
        {
            addModelRun(run, parameterSetId, parameterLookup)
        }
    }

    private fun addUploadInfo(uploader: String, timestamp: Instant): Int
    {
        val uploadInfo = dsl.newRecord(UPLOAD_INFO).apply {
            this.uploadedBy = uploader
            this.uploadedOn = Timestamp.from(timestamp)
        }

        uploadInfo.store()

        return uploadInfo.id
    }

    private fun addParameterSet(responsibilitySetId: Int, modelVersionId: Int,
                                description: String, uploadInfoId: Int): Int
    {
        val newParameterSet = this.dsl.newRecord(MODEL_RUN_PARAMETER_SET).apply {
            this.responsibilitySet = responsibilitySetId
            this.description = description
            this.modelVersion = modelVersionId
            this.uploadInfo = uploadInfoId
        }

        newParameterSet.store()

        return newParameterSet.id
    }

    private fun addParameters(modelRuns: List<ModelRun>, modelRunParameterSetId: Int): Map<String, Int>
    {
        val parameters = modelRuns.first().parameterValues.keys
        return parameters.associateBy({ it }, {
            val record = this.dsl.newRecord(MODEL_RUN_PARAMETER).apply {
                this.key = it
                this.modelRunParameterSet = modelRunParameterSetId
            }
            record.store()
            record.id
        })
    }

    private fun addModelRun(run: ModelRun, modelRunParameterSetId: Int, parameterIds: Map<String, Int>){

        val record = this.dsl.newRecord(MODEL_RUN).apply {
            this.runId = run.runId
            this.modelRunParameterSet = modelRunParameterSetId
        }

        record.store()

        run.parameterValues.map {
            this.dsl.newRecord(MODEL_RUN_PARAMETER_VALUE).apply {
                this.modelRun = record.internalId
                this.modelRunParameter = parameterIds[it.key]
                this.value = it.value
            }.store()
        }
    }

    override fun addBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                                      estimates: Sequence<BurdenEstimate>, uploader: String, timestamp: Instant): Int
    {
        val setId = createBurdenEstimateSet(groupId, touchstoneId, scenarioId, uploader, timestamp)
        populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, estimates)
        return setId
    }

    override fun populateBurdenEstimateSet(setId: Int, groupId: String, touchstoneId: String, scenarioId: String,
                                           estimates: Sequence<BurdenEstimate>)
    {
        val outcomeLookup = getOutcomesAsLookup()
        val cohortSizeId = outcomeLookup["cohort_size"]
                ?: throw DatabaseContentsError("Expected a value with code 'cohort_size' in burden_outcome table")

        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)

        val responsibilityInfo = getResponsibilityInfo(modellingGroup.id, touchstoneId, scenarioId)

        val status = dsl.select(BURDEN_ESTIMATE_SET.STATUS)
                .from(BURDEN_ESTIMATE_SET)
                .where(BURDEN_ESTIMATE_SET.ID.eq(setId))
                .singleOrNull() ?: throw UnknownObjectError(setId, "Burden Estimate Set")

        if (status.into(String::class.java) != "empty")
        {
            throw OperationNotAllowedError("This burden estimate set already contains estimates." +
                    " You must create a new set if you want to upload any new estimates.")
        }
        addEstimatesToSet(estimates, setId, outcomeLookup, cohortSizeId, responsibilityInfo.disease)
        updateCurrentBurdenEstimateSet(responsibilityInfo.id, setId)
    }


    override fun createBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                                         uploader: String, timestamp: Instant): Int
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)

        val responsibilityInfo = getResponsibilityInfo(modellingGroup.id, touchstoneId, scenarioId)
        val status = responsibilityInfo.setStatus.toLowerCase()

        if (status == ResponsibilitySetStatus.SUBMITTED.name.toLowerCase())
        {
            throw OperationNotAllowedError("The burden estimates uploaded for this touchstone have been submitted " +
                    "for review. You cannot upload any new estimates.")
        }

        if (status == ResponsibilitySetStatus.APPROVED.name.toLowerCase())
        {
            throw OperationNotAllowedError("The burden estimates uploaded for this touchstone have been reviewed" +
                    " and approved. You cannot upload any new estimates.")
        }

        val latestModelVersion = dsl.select(MODEL_VERSION.ID)
                .fromJoinPath(MODELLING_GROUP, MODEL)
                .join(MODEL_VERSION)
                .on(MODEL_VERSION.ID.eq(MODEL.CURRENT_VERSION))
                .where(MODELLING_GROUP.ID.eq(modellingGroup.id))
                .and(MODEL.DISEASE.eq(responsibilityInfo.disease))
                .and(MODEL.IS_CURRENT)
                .fetch().singleOrNull()?.value1()
                ?: throw DatabaseContentsError("Modelling group $groupId does not have any models/model versions in the database")

        return addSet(responsibilityInfo.id, uploader, timestamp, latestModelVersion)
    }


    private fun updateCurrentBurdenEstimateSet(responsibilityId: Int, setId: Int)
    {
        dsl.update(RESPONSIBILITY)
                .set(RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET, setId)
                .where(RESPONSIBILITY.ID.eq(responsibilityId))
                .execute()
    }

    private fun addEstimatesToSet(estimates: Sequence<BurdenEstimate>, setId: Int,
                                  outcomeLookup: Map<String, Int>, cohortSizeId: Int,
                                  expectedDisease: String)
    {
        val countries = getAllCountryIds()

        // The only foreign keys are:
        // * burden_estimate_set, which is the same for every row, and it's the one we just created and know exists
        // * country, which we check below, per row of the CSV (and each row represents multiple rows in the database
        //   so this is an effort saving).
        // * burden_outcome, which we check below (currently we check for every row, but given these are set in the
        //   columns and don't vary by row this could be made more efficient)
        dsl.withoutCheckingForeignKeyConstraints(BURDEN_ESTIMATE) {

            // We use dsl.connection to drop down from jOOQ to the JDBC level so we can use CopyManager.
            dsl.connection { connection ->

                PipedOutputStream().use { stream ->

                    // First, let's set up a thread to read from the stream and send
                    // it to the database. This will block if the thread is empty, and keep
                    // going until it sees the Postgres EOF marker.
                    val inputStream = PipedInputStream(stream).buffered()
                    val manager = CopyManager(connection as BaseConnection)
                    val writeToDatabaseThread = writeStreamToDatabase(manager, inputStream)

                    // In the main thread, write to piped stream, blocking if we get too far ahead of
                    // the other thread ("too far ahead" meaning the buffer on the input stream is full)
                    writeCopyData(
                            stream, estimates, expectedDisease,
                            countries, setId, cohortSizeId, outcomeLookup
                    )

                    // Wait for the worker thread has finished
                    writeToDatabaseThread.join()
                }
            }
        }

        dsl.update(BURDEN_ESTIMATE_SET)
                .set(BURDEN_ESTIMATE_SET.STATUS, "complete")
                .where(BURDEN_ESTIMATE_SET.ID.eq(setId))
                .execute()
    }

    private fun writeStreamToDatabase(manager: CopyManager, inputStream: BufferedInputStream): Thread
    {
        // Since we are in another thread here, we should be careful about what state we modify.
        // Everything we have access to here is immutable, so we should be fine.
        return thread(start = true) {
            val t = BURDEN_ESTIMATE
            // This will return once it reaches the EOF character written out by the other stream
            manager.copyInto(BURDEN_ESTIMATE, inputStream, listOf(
                    t.BURDEN_ESTIMATE_SET,
                    t.COUNTRY,
                    t.YEAR,
                    t.AGE,
                    t.STOCHASTIC,
                    t.BURDEN_OUTCOME,
                    t.VALUE
            ))
        }
    }

    private fun writeCopyData(
            stream: OutputStream, estimates: Sequence<BurdenEstimate>,
            expectedDisease: String, countries: HashSet<String>,
            setId: Int, cohortSizeId: Int, outcomeLookup: Map<String, Int>
    )
    {
        // When we exit the 'use' block the EOF character will be written out,
        // signalling to the other thread that we are done.
        PostgresCopyWriter(stream).use { writer ->
            for (estimate in estimates)
            {
                if (estimate.disease != expectedDisease)
                {
                    throw InconsistentDataError("Provided estimate lists disease as '${estimate.disease}' but scenario is for disease '$expectedDisease'")
                }
                if (estimate.country !in countries)
                {
                    throw UnknownObjectError(estimate.country, "country")
                }

                writer.writeRow(newBurdenEstimateRow(setId, estimate, cohortSizeId, estimate.cohortSize))
                for (outcome in estimate.outcomes)
                {
                    val outcomeId = outcomeLookup[outcome.key]
                            ?: throw UnknownObjectError(outcome.key, "burden-outcome")
                    writer.writeRow(newBurdenEstimateRow(setId, estimate, outcomeId, outcome.value))
                }
            }
        }
    }

    private fun getAllCountryIds() = dsl.select(COUNTRY.ID)
            .from(COUNTRY)
            .fetch()
            .map { it[COUNTRY.ID] }
            .toHashSet()

    private fun newBurdenEstimateRow(
            setId: Int,
            estimate: BurdenEstimate,
            outcomeId: Int,
            outcomeValue: BigDecimal?
    ): List<Any?>
    {
        return listOf(
                setId,
                estimate.country,
                estimate.year,
                estimate.age,
                false, /* stochastic */
                outcomeId,
                outcomeValue
        )
    }

    private fun addSet(responsibilityId: Int, uploader: String, timestamp: Instant, modelVersion: Int): Int
    {
        val setRecord = dsl.newRecord(BURDEN_ESTIMATE_SET).apply {
            this.modelVersion = modelVersion
            this.responsibility = responsibilityId
            this.uploadedBy = uploader
            this.uploadedOn = Timestamp.from(timestamp)
            this.runInfo = "Not provided"
            this.interpolated = false
            this.status = "empty"
        }
        setRecord.insert()
        return setRecord.id
    }

    private fun getOutcomesAsLookup(): Map<String, Int>
    {
        return dsl.select(BURDEN_OUTCOME.CODE, BURDEN_OUTCOME.ID)
                .from(BURDEN_OUTCOME)
                .fetch()
                .intoMap(BURDEN_OUTCOME.CODE, BURDEN_OUTCOME.ID)
    }

    private fun getResponsibilityInfo(groupId: String, touchstoneId: String, scenarioId: String): ResponsibilityInfo
    {
        // Get responsibility ID
        return dsl.select(RESPONSIBILITY.ID, SCENARIO_DESCRIPTION.DISEASE, RESPONSIBILITY_SET.STATUS)
                .fromJoinPath(MODELLING_GROUP, RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .joinPath(RESPONSIBILITY_SET, TOUCHSTONE)
                .where(MODELLING_GROUP.ID.eq(groupId))
                .and(TOUCHSTONE.ID.eq(touchstoneId))
                .and(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .fetchOne()
                ?.into(ResponsibilityInfo::class.java)
                ?: findMissingObjects(touchstoneId, scenarioId)
    }

    private fun <T> findMissingObjects(touchstoneId: String, scenarioId: String): T
    {
        touchstoneRepository.touchstones.get(touchstoneId)
        scenarioRepository.checkScenarioDescriptionExists(scenarioId)
        // Note this is where the scenario_description *does* exist, but
        // the group is not responsible for it in this touchstone
        throw UnknownObjectError(scenarioId, "responsibility")
    }
}