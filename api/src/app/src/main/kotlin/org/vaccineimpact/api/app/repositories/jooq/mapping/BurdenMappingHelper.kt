package org.vaccineimpact.api.app.repositories.jooq.mapping

import org.jooq.Record
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET
import org.vaccineimpact.api.db.Tables.MODEL_RUN_PARAMETER_VALUE
import org.vaccineimpact.api.db.Tables.MODEL_RUN_PARAMETER
import org.vaccineimpact.api.db.Tables.MODEL_RUN
import org.vaccineimpact.api.models.*

class BurdenMappingHelper : MappingHelper()
{
    fun mapBurdenEstimateSetType(record: Record) =
            mapBurdenEstimateSetType(
                    record[Tables.BURDEN_ESTIMATE_SET.SET_TYPE],
                    record[Tables.BURDEN_ESTIMATE_SET.SET_TYPE_DETAILS]
            )
    fun mapBurdenEstimateSetType(code: String, details: String?) =
            BurdenEstimateSetType(mapEnum(code), details)

    fun mapBurdenEstimateSets(records: List<Record>): List<BurdenEstimateSet>
    {
        return records
                .groupBy { it[BURDEN_ESTIMATE_SET.ID] }
                .map(this::mapBurdenEstimateSet)
    }

    fun mapBurdenEstimateSet(group: Map.Entry<Int, List<Record>>): BurdenEstimateSet
    {
        val table = BURDEN_ESTIMATE_SET
        val common = group.value.first()
        val problems = group.value.mapNotNull { it[Tables.BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM] }
        return BurdenEstimateSet(
                common[table.ID],
                common[table.UPLOADED_ON].toInstant(),
                common[table.UPLOADED_BY],
                mapBurdenEstimateSetType(common),
                mapEnum(common[table.STATUS]),
                problems
        )
    }

    fun mapModelParameterValuesPlain(record: Record): ModelRunParametersValue
    {
        return ModelRunParametersValue(
                record[MODEL_RUN_PARAMETER_VALUE.ID],
                record[MODEL_RUN_PARAMETER.KEY],
                record[MODEL_RUN.RUN_ID],
                record[MODEL_RUN_PARAMETER_VALUE.VALUE]
        )
    }

    fun mapModelParameterValuesGrouped(runId: String, records: List<ModelRunParametersValue>) : ModelRun
    {
        val map = records.associateBy({ it.key }, { it.value})
        return ModelRun(runId, map)
    }

    fun mapModelParameterHeaders(record: Record): String
    {
        return record[MODEL_RUN_PARAMETER.KEY]
    }
}