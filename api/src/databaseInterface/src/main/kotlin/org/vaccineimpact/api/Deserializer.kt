package org.vaccineimpact.api

import java.lang.UnsupportedOperationException
import java.math.BigDecimal
import kotlin.reflect.KType

class Deserializer
{
    inline fun <reified T : Enum<T>> parseEnum(name: String): T
    {
        return enumValues<T>()
                .firstOrNull { name.replace('-', '_').equals(it.name, ignoreCase = true) }
                ?: throw UnknownEnumValue(name, T::class.simpleName ?: "[unknown]")
    }

    fun <T> deserialize(raw: String, targetType: KType): T
    {
        val result: Any = when (targetType)
        {
            String::class -> raw
            Int::class -> raw.toInt()
            BigDecimal::class.java -> BigDecimal(raw)
            else -> throw UnsupportedOperationException("Deserializer does not support target type $targetType")
        }
        @Suppress("UNCHECKED_CAST")
        return result as T
    }
}