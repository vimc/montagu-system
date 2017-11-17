package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record
import org.vaccineimpact.api.app.errors.BadDatabaseConstant
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET_TYPE
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.serialization.Deserializer
import org.vaccineimpact.api.serialization.UnknownEnumValue

class MappingHelpers(val deserializer: Deserializer = Deserializer())
{
    inline fun <reified T : Enum<T>> mapEnum(raw: String): T
    {
        return try
        {
            deserializer.parseEnum(raw)
        }
        catch (e: UnknownEnumValue)
        {
            throw BadDatabaseConstant(e.name, e.type)
        }
    }

    fun mapBurdenEstimateSetType(record: Record) =
            mapBurdenEstimateSetType(
                    record[BURDEN_ESTIMATE_SET.SET_TYPE],
                    record[BURDEN_ESTIMATE_SET.SET_TYPE_DETAILS]
            )
    fun mapBurdenEstimateSetType(code: String, details: String?) =
            BurdenEstimateSetType(mapEnum(code), details)
}