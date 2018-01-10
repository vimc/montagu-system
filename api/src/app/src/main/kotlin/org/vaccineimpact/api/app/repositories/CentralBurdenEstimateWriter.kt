package org.vaccineimpact.api.app.repositories

import org.jooq.DSLContext
import org.jooq.TableField
import org.jooq.impl.TableImpl
import org.postgresql.copy.CopyManager
import org.postgresql.core.BaseConnection
import org.vaccineimpact.api.app.repositories.jooq.BurdenEstimateCopyWriter
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.copyInto
import org.vaccineimpact.api.db.withoutCheckingForeignKeyConstraints
import org.vaccineimpact.api.models.BurdenEstimateWithRunId
import java.io.BufferedInputStream
import java.io.PipedInputStream
import java.io.PipedOutputStream
import kotlin.concurrent.thread

open class BurdenEstimateWriter(private val dsl: DSLContext,
                                private val burdenEstimateCopyWriter: BurdenEstimateCopyWriter,
                                stochastic: Boolean)
{

    private val table: TableImpl<*> = if (stochastic)
    {
        Tables.BURDEN_ESTIMATE_STOCHASTIC
    }
    else
    {
        Tables.BURDEN_ESTIMATE
    }

    private val fields: List<TableField<*, *>> = if (stochastic)
    {
        val t = Tables.BURDEN_ESTIMATE
        listOf(
                t.BURDEN_ESTIMATE_SET,
                t.MODEL_RUN,
                t.COUNTRY,
                t.YEAR,
                t.AGE,
                t.BURDEN_OUTCOME,
                t.VALUE
        )
    }
    else
    {
        val t = Tables.BURDEN_ESTIMATE_STOCHASTIC
        listOf(
                t.BURDEN_ESTIMATE_SET,
                t.MODEL_RUN,
                t.COUNTRY,
                t.YEAR,
                t.AGE,
                t.BURDEN_OUTCOME,
                t.VALUE
        )
    }

    private fun writeStreamToDatabase(
            inputStream: BufferedInputStream
    ): Thread
    {
        // Since we are in another thread here, we should be careful about what state we modify.
        // Everything we have access to here is immutable, so we should be fine.
        return thread(start = true) {
            // We use dsl.connection to drop down from jOOQ to the JDBC level so we can use CopyManager.
            dsl.connection { connection ->
                val manager = CopyManager(connection as BaseConnection)
                // This will return once it reaches the EOF character written out by the other stream
                manager.copyInto(table, inputStream, fields)
            }
        }
    }

    fun addEstimatesToSet(setId: Int, estimates: Sequence<BurdenEstimateWithRunId>, expectedDisease: String)
    {
        // The only foreign keys are:
        // * burden_estimate_set, which is the same for every row, and it's the one we just created and know exists
        // * country, which we check below, per row of the CSV (and each row represents multiple rows in the database
        //   so this is an effort saving).
        // * burden_outcome, which we check below (currently we check for every row, but given these are set in the
        //   columns and don't vary by row this could be made more efficient)
        dsl.withoutCheckingForeignKeyConstraints(table) {

            PipedOutputStream().use { stream ->
                // First, let's set up a thread to read from the stream and send
                // it to the database. This will block if the thread is empty, and keep
                // going until it sees the Postgres EOF marker.
                val inputStream = PipedInputStream(stream).buffered()
                val writeToDatabaseThread = writeStreamToDatabase(inputStream)

                // In the main thread, write to piped stream, blocking if we get too far ahead of
                // the other thread ("too far ahead" meaning the buffer on the input stream is full)
                burdenEstimateCopyWriter.writeCopyData(stream, estimates, expectedDisease, setId)

                // Wait for the worker thread to finished
                writeToDatabaseThread.join()
            }
        }
    }
}