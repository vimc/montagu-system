package org.vaccineimpact.api.app.repositories.jooq.mapping

import org.vaccineimpact.api.app.errors.BadDatabaseConstant
import org.vaccineimpact.api.serialization.Deserializer
import org.vaccineimpact.api.serialization.UnknownEnumValue

open class MappingHelper(val deserializer: Deserializer = Deserializer())
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
}