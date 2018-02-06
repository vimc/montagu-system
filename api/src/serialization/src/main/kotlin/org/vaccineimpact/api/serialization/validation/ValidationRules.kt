package org.vaccineimpact.api.serialization.validation

import com.sun.org.apache.xpath.internal.operations.Bool
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.validation.AllowedFormat
import org.vaccineimpact.api.models.validation.MinimumLength
import org.vaccineimpact.api.models.validation.RequiredWhen
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.declaredMembers
import kotlin.reflect.full.memberFunctions
import kotlin.reflect.full.memberProperties

class Validator(private val serializer: Serializer = MontaguSerializer.instance)
{
    fun checkMissing(property: KProperty1<Any, *>, model: Any, name: String): List<ErrorInfo>
    {
        property.get(model) ?: return listOf(ErrorInfo(
                "invalid-field:$name:missing",
                "You have not supplied a value, or have supplied a null value, for field '$name'"
        ))

        return listOf()
    }

    fun nullableCheck(property: KProperty1<Any, *>, model: Any, name: String): List<ErrorInfo>?
    {
        if (property.returnType.isMarkedNullable)
            return null

        val value = property.get(model) ?: return listOf(ErrorInfo(
                "invalid-field:$name:missing",
                "You have not supplied a value, or have supplied a null value, for field '$name'"
        ))

        if (!value::class.isData)
        {
            return null
        }

        val members = value::class.memberProperties.filterIsInstance<KProperty1<Any, *>>()

        if (!members.any())
        {
            return null
        }

        return members.flatMap { nullableCheck(it, value, serializer.convertFieldName(it.name)) ?: listOf() }
    }

    fun applyRule(annotation: Annotation, property: KProperty1<Any, *>, fieldName: String, model: Any): List<ErrorInfo>
    {
        val value = property.get(model)
        return when (annotation)
        {
            is AllowedFormat -> checkFormat(annotation, value, fieldName)
            is MinimumLength -> checkLength(annotation, value, fieldName)
            is RequiredWhen -> checkRequiredWhen(annotation, property, fieldName, model)
            else -> listOf()
        }
    }

    fun checkFormat(format: AllowedFormat, value: Any?, name: String): List<ErrorInfo>
    {
        if (value is String && !value.isBlank())
        {
            val regex = Regex(format.pattern)
            if (!regex.matches(value))
            {
                return listOf(ErrorInfo(
                        "invalid-field:$name:bad-format",
                        "The '$name' field must be in the form '${format.example}'"
                ))
            }
        }
        return listOf()
    }

    fun checkLength(length: MinimumLength, value: Any?, name: String): List<ErrorInfo>
    {
        if (value is String && !value.isBlank())
        {
            if (value.length < length.length)
            {
                return listOf(ErrorInfo(
                        "invalid-field:$name:too-short",
                        "The '$name' field must be at least ${length.length} characters long"
                ))
            }
        }
        return listOf()
    }

    fun checkRequiredWhen(requiredWhen: RequiredWhen, property: KProperty1<Any, *>, name: String, model: Any): List<ErrorInfo>
    {
        val functionName = requiredWhen.functionName
        val requiredPropertyName = requiredWhen.propertyName
        val functions = model::class.memberFunctions
        val function = functions.singleOrNull { it.name == functionName && it.returnType.classifier == Boolean::class }
                ?: throw Exception("Class '${model::class.simpleName}' doesn't have a function '$functionName'")

        val properties = model::class.declaredMemberProperties
        val requiredProperty = properties
                .filterIsInstance<KProperty1<Any, *>>()
                .singleOrNull { it.name == requiredPropertyName }
                ?: throw Exception("Class '${model::class.simpleName}' doesn't have a property '$requiredPropertyName'")

        val validationErrorsForRequiredProperty = nullableCheck(requiredProperty, model, requiredPropertyName)
        if (validationErrorsForRequiredProperty != null && validationErrorsForRequiredProperty.any())
        {
            return validationErrorsForRequiredProperty
        }
        val dependentValue = function.call(model, requiredProperty.get(model)) as Boolean
        if (dependentValue)
        {
            return checkMissing(property, model, name)
        }
        return listOf()
    }
}