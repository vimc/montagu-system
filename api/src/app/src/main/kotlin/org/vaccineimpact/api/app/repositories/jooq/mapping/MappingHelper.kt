package org.vaccineimpact.api.app.repositories.jooq.mapping

import org.vaccineimpact.api.app.errors.BadDatabaseConstant
import org.vaccineimpact.api.serialization.Deserializer
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import org.vaccineimpact.api.serialization.UnknownEnumValue

open class MappingHelper(
        val deserializer: Deserializer = Deserializer(),
        val serializer: Serializer = MontaguSerializer()
)
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

    inline fun <reified T : Enum<T>> mapNullableEnum(raw: String?): T?
    {
        if (raw == null)
        {
            return null
        }

        return mapEnum<T>(raw)
    }

    inline fun <reified T : Enum<T>> mapEnum(value: T): String
            = serializer.serializeEnum(value)
}