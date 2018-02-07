package org.vaccineimpact.api.serialization.validation

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.validation.AllowedFormat
import org.vaccineimpact.api.models.validation.MinimumLength
import org.vaccineimpact.api.models.validation.RequiredWhen
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.memberFunctions
import kotlin.reflect.full.memberProperties

class Validator(private val serializer: Serializer = MontaguSerializer.instance)
{

    fun nullCheck(property: KProperty1<Any, *>, model: Any, name: String): List<ErrorInfo>?
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

        return members.flatMap { nullCheck(it, value, serializer.convertFieldName(it.name)) ?: listOf() }
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

    private fun checkMissing(property: KProperty1<Any, *>, model: Any, name: String): List<ErrorInfo>
    {
        property.get(model) ?: return listOf(ErrorInfo(
                "invalid-field:$name:missing",
                "You have not supplied a value, or have supplied a null value, for field '$name'"
        ))

        return listOf()
    }

    private fun checkFormat(format: AllowedFormat, value: Any?, name: String): List<ErrorInfo>
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

    private fun checkLength(length: MinimumLength, value: Any?, name: String): List<ErrorInfo>
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

    private fun checkRequiredWhen(requiredWhen: RequiredWhen, property: KProperty1<Any, *>, name: String, model: Any): List<ErrorInfo>
    {
        val functionName = requiredWhen.functionName
        val requiredPropertyNames = requiredWhen.dependentProperties.toList()
        val functions = model::class.memberFunctions
        val function = functions.singleOrNull { it.name == functionName && it.returnType.classifier == Boolean::class }
                ?: throw Exception("Class '${model::class.simpleName}' doesn't have a function '$functionName'")

        val validationErrorsForRequiredProperties = checkDependentProperties(requiredPropertyNames, model)
        if (validationErrorsForRequiredProperties.any())
        {
            return validationErrorsForRequiredProperties
        }
        val dependentValue = function.call(model) as Boolean
        if (dependentValue)
        {
            return checkMissing(property, model, name)
        }
        return listOf()
    }

    private fun checkDependentProperties(requiredPropertyNames: List<String>, model: Any): List<ErrorInfo>
    {
        val properties = model::class.declaredMemberProperties
        val requiredProperties = properties
                .filterIsInstance<KProperty1<Any, *>>()
                .filter { requiredPropertyNames.contains(it.name) }

        return requiredProperties.flatMap{ checkDependentProperty(requiredProperties, it.name, model) }
    }

    private fun checkDependentProperty(properties: List<KProperty1<Any, *>>, requiredPropertyName: String, model: Any): List<ErrorInfo>
    {
        val property = properties.find { it.name == requiredPropertyName }
                ?: throw Exception("Class '${model::class.simpleName}' doesn't have a property '$requiredPropertyName'")

        return nullCheck(property, model, requiredPropertyName)
                ?: listOf()
    }
}