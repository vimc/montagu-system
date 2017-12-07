package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.TableField
import org.jooq.impl.TableImpl
import org.postgresql.copy.CopyManager
import org.postgresql.core.BaseConnection
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.errors.UnknownRunIdError
import org.vaccineimpact.api.db.*
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.BurdenEstimateWithRunId
import java.io.BufferedInputStream
import java.io.OutputStream
import java.io.PipedInputStream
import java.io.PipedOutputStream
import java.math.BigDecimal
import kotlin.concurrent.thread

class BurdenEstimateWriter(val dsl: DSLContext, val setId: Int)
{
    private val countries = getAllCountryIds()
    private val modelRuns = getModelRunsAsLookup(setId)
    private val outcomeLookup = getOutcomesAsLookup()
    private val cohortSizeId = outcomeLookup["cohort_size"]
            ?: throw DatabaseContentsError("Expected a value with code 'cohort_size' in burden_outcome table")

    fun addEstimatesToSet(estimates: Sequence<BurdenEstimateWithRunId>, expectedDisease: String)
    {
        // The only foreign keys are:
        // * burden_estimate_set, which is the same for every row, and it's the one we just created and know exists
        // * country, which we check below, per row of the CSV (and each row represents multiple rows in the database
        //   so this is an effort saving).
        // * burden_outcome, which we check below (currently we check for every row, but given these are set in the
        //   columns and don't vary by row this could be made more efficient)
        dsl.withoutCheckingForeignKeyConstraints(Tables.BURDEN_ESTIMATE) {

            PipedOutputStream().use { stream ->
                // First, let's set up a thread to read from the stream and send
                // it to the database. This will block if the thread is empty, and keep
                // going until it sees the Postgres EOF marker.
                val inputStream = PipedInputStream(stream).buffered()
                val t = Tables.BURDEN_ESTIMATE
                val writeToDatabaseThread = writeStreamToDatabase(dsl, inputStream, t, listOf(
                        t.BURDEN_ESTIMATE_SET,
                        t.MODEL_RUN,
                        t.COUNTRY,
                        t.YEAR,
                        t.AGE,
                        t.BURDEN_OUTCOME,
                        t.VALUE
                ))

                // In the main thread, write to piped stream, blocking if we get too far ahead of
                // the other thread ("too far ahead" meaning the buffer on the input stream is full)
                writeCopyData(stream, estimates, expectedDisease, setId)

                // Wait for the worker thread to finished
                writeToDatabaseThread.join()
            }
        }
    }

    private fun writeStreamToDatabase(
            dsl: DSLContext, inputStream: BufferedInputStream,
            target: TableImpl<*>, fields: List<TableField<*, *>>
    ): Thread
    {
        // Since we are in another thread here, we should be careful about what state we modify.
        // Everything we have access to here is immutable, so we should be fine.
        return thread(start = true) {
            // We use dsl.connection to drop down from jOOQ to the JDBC level so we can use CopyManager.
            dsl.connection { connection ->
                val manager = CopyManager(connection as BaseConnection)
                // This will return once it reaches the EOF character written out by the other stream
                manager.copyInto(target, inputStream, fields)
            }
        }
    }

    private fun writeCopyData(
            stream: OutputStream, estimates: Sequence<BurdenEstimateWithRunId>,
            expectedDisease: String, setId: Int
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
                val modelRun = resolveRunId(estimate.runId)

                writer.writeRow(newBurdenEstimateRow(setId, modelRun, estimate, cohortSizeId, estimate.cohortSize))
                for (outcome in estimate.outcomes)
                {
                    val outcomeId = outcomeLookup[outcome.key]
                            ?: throw UnknownObjectError(outcome.key, "burden-outcome")
                    writer.writeRow(newBurdenEstimateRow(setId, modelRun, estimate, outcomeId, outcome.value))
                }
            }
        }
    }

    private fun newBurdenEstimateRow(
            setId: Int,
            modelRun: Int?,
            estimate: BurdenEstimateWithRunId,
            outcomeId: Int,
            outcomeValue: BigDecimal?
    ): List<Any?>
    {
        return listOf(
                setId,
                modelRun,
                estimate.country,
                estimate.year,
                estimate.age,
                outcomeId,
                outcomeValue
        )
    }

    private fun resolveRunId(runId: String?): Int?
    {
        // If we are expecting run IDs not to be null (i.e. for stochastic estimates)
        // we expect this to have been caught at an earlier stage, during CSV parsing
        return if (runId == null)
        {
            null
        }
        else
        {
            val modelRunParameterSetId = dsl.select(BURDEN_ESTIMATE_SET.MODEL_RUN_PARAMETER_SET)
                    .from(BURDEN_ESTIMATE_SET)
                    .where(BURDEN_ESTIMATE_SET.ID.eq(setId))
                    .fetchOneInto(Int::class.java)

            modelRuns.getOrDefault(runId, null)
                    ?: throw UnknownRunIdError(runId, modelRunParameterSetId)
        }
    }

    private fun getAllCountryIds() = dsl.select(Tables.COUNTRY.ID)
            .from(Tables.COUNTRY)
            .fetch()
            .map { it[Tables.COUNTRY.ID] }
            .toHashSet()

    private fun getOutcomesAsLookup(): Map<String, Int>
    {
        return dsl.select(Tables.BURDEN_OUTCOME.CODE, Tables.BURDEN_OUTCOME.ID)
                .from(Tables.BURDEN_OUTCOME)
                .fetch()
                .intoMap(Tables.BURDEN_OUTCOME.CODE, Tables.BURDEN_OUTCOME.ID)
    }

    private fun getModelRunsAsLookup(setId: Int): Map<String, Int>
    {
        // This gets us from user defined run IDs (e.g. "run_with_extra_toffee")
        // to our auto-generated internal IDs (e.g. 4532)
        return dsl.select(MODEL_RUN.INTERNAL_ID, MODEL_RUN.RUN_ID)
                .fromJoinPath(BURDEN_ESTIMATE_SET, MODEL_RUN_PARAMETER_SET, MODEL_RUN)
                .where(BURDEN_ESTIMATE_SET.ID.eq(setId))
                .fetch()
                .map { it[MODEL_RUN.RUN_ID] to it[MODEL_RUN.INTERNAL_ID] }
                .toMap()
    }
}