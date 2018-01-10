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
import org.vaccineimpact.api.models.BurdenEstimateWithRunId
import java.io.BufferedInputStream
import java.io.OutputStream
import java.math.BigDecimal
import kotlin.concurrent.thread

class BurdenEstimateWriter(val dsl: DSLContext)
{
    private val countries = getAllCountryIds()
    private val outcomeLookup = getOutcomesAsLookup()

    fun writeStreamToDatabase(
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

    fun writeCopyData(
            stream: OutputStream, estimates: Sequence<BurdenEstimateWithRunId>,
            expectedDisease: String, setId: Int
    )
    {
        val modelRuns = getModelRunsAsLookup(setId)
        val modelRunParameterSetId = getModelRunParameterSetId(setId)
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
            dsl.select(BURDEN_ESTIMATE_SET.MODEL_RUN_PARAMETER_SET)
                    .from(BURDEN_ESTIMATE_SET)
                    .where(BURDEN_ESTIMATE_SET.ID.eq(setId))
                    .fetch()
                    .singleOrNull()?.value1()

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