package org.vaccineimpact.api.serialization

import org.vaccineimpact.api.models.ActivityType
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.GAVISupportLevel
import org.vaccineimpact.api.models.GenderEnum
import org.vaccineimpact.api.serialization.validation.ValidationException
import java.lang.UnsupportedOperationException
import java.util.*
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
            Short::class.createType() -> raw.toShort()
            Float::class.createType() -> raw.toFloat()
            Boolean::class.createType() -> raw.toBooleanValidate()
            ActivityType::class.createType() -> ActivityType.valueOf(raw.uppercase())
            GAVISupportLevel::class.createType() -> GAVISupportLevel.valueOf(raw.uppercase())
            GenderEnum::class.createType() -> GenderEnum.valueOf(raw.uppercase())
            else -> throw UnsupportedOperationException("org.vaccineimpact.api.serialization.Deserializer does not support target type $targetType")
        }
    }

    private fun String.toBooleanValidate() = when
    {
        equals("true", ignoreCase = true) -> true
        equals("false", ignoreCase = true) -> false
        else -> throw ValidationException(listOf(ErrorInfo("invalid-boolean", "Unable to parse '$this' as Boolean")))
    }
}
