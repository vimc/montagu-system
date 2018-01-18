package org.vaccineimpact.api.app.repositories.burdenestimates

import org.jooq.DSLContext
import org.jooq.TableField
import org.jooq.impl.TableImpl
import org.vaccineimpact.api.db.AnnexJooqContext
import org.vaccineimpact.api.db.Tables

open class StochasticBurdenEstimateWriter(
        readDatabaseDSL: DSLContext,
        writeDatabaseDSLPromise: () -> DSLContext = { AnnexJooqContext().dsl }
) : BurdenEstimateWriter(readDatabaseDSL, writeDatabaseDSLPromise)
{
    override val table: TableImpl<*> = Tables.BURDEN_ESTIMATE_STOCHASTIC
    override val fields by lazy {
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
    override val setField: TableField<*, Int> = Tables.BURDEN_ESTIMATE_STOCHASTIC.BURDEN_ESTIMATE_SET
}