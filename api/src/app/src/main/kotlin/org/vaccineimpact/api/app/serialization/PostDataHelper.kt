package org.vaccineimpact.api.app.serialization

import org.vaccineimpact.api.app.errors.ValidationError
import org.vaccineimpact.api.models.ErrorInfo
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

annotation class CanBeBlank
annotation class AllowedFormat(val pattern: String, val example: String)

class PostDataHelper
{
    fun <T: Any> deserialize(body: String, klass: Class<T>): T
    {
        val model = Serializer.instance.fromJson(body, klass)
        val errors = verify(model)
        if (errors.any())
        {
            throw ValidationError(errors)
        }
        return model
    }

    fun verify(model: Any): List<ErrorInfo>
    {
        val properties = model::class.memberProperties.filterIsInstance<KProperty1<Any, *>>()
        return properties.flatMap { verify(it, model) }
    }

    fun verify(property: KProperty1<Any, *>, model: Any): List<ErrorInfo>
    {
        val errors = mutableListOf<ErrorInfo>()
        val name = property.name
        val value = property.get(model)

        if (value == null && !property.returnType.isMarkedNullable)
        {
            errors += ErrorInfo(
                    "invalid-field:$name:missing",
                    "You have not supplied a value, or have supplied a null value, for field '$name'"
            )
        }
        if (value is String && value.isBlank() && property.findAnnotation<CanBeBlank>() == null)
        {
            errors += ErrorInfo(
                    "invalid-field:$name:blank",
                    "You have supplied an empty or blank string for field '$name'"
            )
        }
        val format = property.findAnnotation<AllowedFormat>()
        if (format != null && value is String)
        {
            val regex = Regex(format.pattern)
            if (!regex.matches(value))
            {
                errors += ErrorInfo(
                        "invalid-field:$name:bad-format",
                        "The '$name' field must be in the form '${format.example}'"
                )
            }
        }
        return errors
    }
}