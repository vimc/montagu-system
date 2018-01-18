package org.vaccineimpact.api.app.repositories.burdenestimates

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
import org.vaccineimpact.api.models.BurdenEstimateWithRunId
import java.io.*
import java.math.BigDecimal
import kotlin.concurrent.thread

abstract class BurdenEstimateWriter(
        private val readDatabaseDSL: DSLContext,
        private val writeDatabaseDSLSource: CloseableContext
)
{
    protected abstract val table: TableImpl<*>
    protected abstract val fields: List<TableField<*, *>>
    protected abstract val setField: TableField<*, Int>

    open fun addEstimatesToSet(setId: Int, estimates: Sequence<BurdenEstimateWithRunId>, expectedDisease: String)
    {
        val countries = getAllCountryIds()
        val outcomeLookup = getOutcomesAsLookup()
        val modelRuns = getModelRunsAsLookup(setId)
        val modelRunParameterId = getModelRunParameterSetId(setId)
        writeDatabaseDSLSource.inside { writeDatabaseDSL ->
            // The only foreign keys are:
            // * burden_estimate_set, which is the same for every row, and it's the one we just created and know exists
            // * country, which we check below, per row of the CSV (and each row represents multiple rows in the database
            //   so this is an effort saving).
            // * burden_outcome, which we check below (currently we check for every row, but given these are set in the
            //   columns and don't vary by row this could be made more efficient)
            writeDatabaseDSL.withoutCheckingForeignKeyConstraints(table) {

                PipedOutputStream().use { stream ->
                    // First, let's set up a thread to read from the stream and send
                    // it to the database. This will block if the thread is empty, and keep
                    // going until it sees the Postgres EOF marker.
                    val inputStream = PipedInputStream(stream).buffered()
                    val writeToDatabaseThread = writeStreamToDatabase(inputStream, writeDatabaseDSL)

                    // In the main thread, write to piped stream, blocking if we get too far ahead of
                    // the other thread ("too far ahead" meaning the buffer on the input stream is full)
                    writeCopyData(
                            outcomeLookup,
                            countries,
                            modelRuns,
                            modelRunParameterId,
                            stream,
                            estimates,
                            expectedDisease,
                            setId)

                    // Wait for the worker thread to finished
                    writeToDatabaseThread.join()
                }
            }
        }
    }

    fun clearEstimateSet(setId: Int)
    {
        writeDatabaseDSLSource.inside { dsl ->
            dsl.deleteFrom(table).where(setField.eq(setId)).execute()
        }
    }

    private fun writeCopyData(outcomeLookup: Map<String, Int>, countries: HashSet<String>, modelRuns: Map<String, Int>, modelRunParameterSetId: Int?,
                              stream: OutputStream, estimates: Sequence<BurdenEstimateWithRunId>,
                              expectedDisease: String, setId: Int
    )
    {
        val cohortSizeId = outcomeLookup["cohort_size"]
                ?: throw DatabaseContentsError("Expected a value with code 'cohort_size' in burden_outcome table")

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
                val modelRun = resolveRunId(modelRuns, modelRunParameterSetId, estimate.runId)

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

    private fun resolveRunId(modelRuns: Map<String, Int>, modelRunParameterSetId: Int?, runId: String?): Int?
    {
        // If we are expecting run IDs not to be null (i.e. for stochastic estimates)
        // we expect this to have been caught at an earlier stage, during CSV parsing
        return if (runId == null)
        {
            null
        }
        else
        {
            modelRuns.getOrDefault(runId, null)
                    ?: throw UnknownRunIdError(runId, modelRunParameterSetId)
        }
    }

    private fun getModelRunParameterSetId(setId: Int): Int? =
            readDatabaseDSL.select(Tables.BURDEN_ESTIMATE_SET.MODEL_RUN_PARAMETER_SET)
                    .from(Tables.BURDEN_ESTIMATE_SET)
                    .where(Tables.BURDEN_ESTIMATE_SET.ID.eq(setId))
                    .fetch()
                    .singleOrNull()?.value1()

    private fun getAllCountryIds() = readDatabaseDSL.select(Tables.COUNTRY.ID)
            .from(Tables.COUNTRY)
            .fetch()
            .map { it[Tables.COUNTRY.ID] }
            .toHashSet()

    private fun getOutcomesAsLookup(): Map<String, Int>
    {
        return readDatabaseDSL.select(Tables.BURDEN_OUTCOME.CODE, Tables.BURDEN_OUTCOME.ID)
                .from(Tables.BURDEN_OUTCOME)
                .fetch()
                .intoMap(Tables.BURDEN_OUTCOME.CODE, Tables.BURDEN_OUTCOME.ID)
    }

    private fun getModelRunsAsLookup(setId: Int): Map<String, Int>
    {
        // This gets us from user defined run IDs (e.g. "run_with_extra_toffee")
        // to our auto-generated internal IDs (e.g. 4532)
        return readDatabaseDSL.select(Tables.MODEL_RUN.INTERNAL_ID, Tables.MODEL_RUN.RUN_ID)
                .fromJoinPath(Tables.BURDEN_ESTIMATE_SET, Tables.MODEL_RUN_PARAMETER_SET, Tables.MODEL_RUN)
                .where(Tables.BURDEN_ESTIMATE_SET.ID.eq(setId))
                .fetch()
                .map { it[Tables.MODEL_RUN.RUN_ID] to it[Tables.MODEL_RUN.INTERNAL_ID] }
                .toMap()
    }

    private fun writeStreamToDatabase(
            inputStream: BufferedInputStream,
            writeDatabaseDSL: DSLContext
    ): Thread
    {
        // Since we are in another thread here, we should be careful about what state we modify.
        // Everything we have access to here is immutable, so we should be fine.
        return thread(start = true) {
            // We use dsl.connection to drop down from jOOQ to the JDBC level so we can use CopyManager.
            writeDatabaseDSL.connection { connection ->
                val manager = CopyManager(connection as BaseConnection)
                // This will return once it reaches the EOF character written out by the other stream
                manager.copyInto(table, inputStream, fields)
            }
        }
    }
}