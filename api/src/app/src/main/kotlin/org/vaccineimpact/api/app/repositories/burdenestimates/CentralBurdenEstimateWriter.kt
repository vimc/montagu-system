package org.vaccineimpact.api.app.repositories.burdenestimates

import org.jooq.DSLContext
import org.jooq.TableField
import org.jooq.impl.TableImpl
import org.vaccineimpact.api.db.AmbientDSLContext
import org.vaccineimpact.api.db.Tables

open class CentralBurdenEstimateWriter(readDatabaseDSL: DSLContext)
    : BurdenEstimateWriter(readDatabaseDSL, AmbientDSLContext(readDatabaseDSL))
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
}