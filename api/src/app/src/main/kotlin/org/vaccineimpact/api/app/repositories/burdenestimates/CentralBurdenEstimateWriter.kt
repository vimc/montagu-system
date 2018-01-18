package org.vaccineimpact.api.app.repositories.burdenestimates

import org.jooq.DSLContext
import org.jooq.TableField
import org.jooq.impl.TableImpl
import org.vaccineimpact.api.db.Tables

class CentralBurdenEstimateWriter(readDatabaseDSL: DSLContext)
    : BurdenEstimateWriter(readDatabaseDSL, { readDatabaseDSL })
{
    override val table: TableImpl<*> = Tables.BURDEN_ESTIMATE
    override val fields by lazy {
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
    override val setField: TableField<*, Int> = Tables.BURDEN_ESTIMATE.BURDEN_ESTIMATE_SET
}