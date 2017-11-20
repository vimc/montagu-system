package org.vaccineimpact.api.app.repositories.jooq.mapping

import org.jooq.Record
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.models.BurdenEstimateSetType

class BurdenMappingHelper : MappingHelper()
{
    fun mapBurdenEstimateSetType(record: Record) =
            mapBurdenEstimateSetType(
                    record[Tables.BURDEN_ESTIMATE_SET.SET_TYPE],
                    record[Tables.BURDEN_ESTIMATE_SET.SET_TYPE_DETAILS]
            )
    fun mapBurdenEstimateSetType(code: String, details: String?) =
            BurdenEstimateSetType(mapEnum(code), details)
}