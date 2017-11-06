package org.vaccineimpact.api.serialization

import java.lang.UnsupportedOperationException
import java.math.BigDecimal
import kotlin.reflect.KType
import kotlin.reflect.full.createType
import kotlin.reflect.full.withNullability

class Deserializer
{
    inline fun <reified T : Enum<T>> parseEnum(name: String): T
    {
        return enumValues<T>()
                .firstOrNull { name.replace('-', '_').equals(it.name, ignoreCase = true) }
                ?: throw UnknownEnumValue(name, T::class.simpleName ?: "[unknown]")
    }

    fun deserialize(raw: String, targetType: KType): Any? = if (targetType.isMarkedNullable)
    {
        if (raw == "NA")
        {
            null
        }
        else
        {
            deserialize(raw, targetType.withNullability(false))
        }
    }
    else
    {
        when (targetType)
        {
            String::class.createType() -> raw
            Int::class.createType() -> raw.toInt()
            BigDecimal::class.createType() -> BigDecimal(raw)
            else -> throw UnsupportedOperationException("org.vaccineimpact.api.serialization.Deserializer does not support target type $targetType")
        }
    }
}