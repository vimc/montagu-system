package org.vaccineimpact.api.serialization.validation

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.validation.AllowedFormat
import org.vaccineimpact.api.models.validation.MinimumLength
import org.vaccineimpact.api.models.validation.RequiredWhen
import kotlin.reflect.full.memberFunctions

fun applyRule(annotation: Annotation, value: Any?, fieldName: String, model: Any): ErrorInfo? =
        when (annotation)
        {
            is AllowedFormat -> checkFormat(annotation, value, fieldName)
            is MinimumLength -> checkLength(annotation, value, fieldName)
            is RequiredWhen -> checkRequiredWhen(annotation, value, fieldName, model)
            else -> null
        }

fun checkFormat(format: AllowedFormat, value: Any?, name: String): ErrorInfo?
{
    if (value is String && !value.isBlank())
    {
        val regex = Regex(format.pattern)
        if (!regex.matches(value))
        {
            return ErrorInfo(
                    "invalid-field:$name:bad-format",
                    "The '$name' field must be in the form '${format.example}'"
            )
        }
    }
    return null
}

fun checkLength(length: MinimumLength, value: Any?, name: String): ErrorInfo?
{
    if (value is String && !value.isBlank())
    {
        if (value.length < length.length)
        {
            return ErrorInfo(
                    "invalid-field:$name:too-short",
                    "The '$name' field must be at least ${length.length} characters long"
            )
        }
    }
    return null
}

fun checkRequiredWhen(requiredWhen: RequiredWhen, value: Any?, name: String, model: Any): ErrorInfo?
{
    val functionName = requiredWhen.functionName
    val functions = model::class.memberFunctions
    val function = functions.singleOrNull { it.name == functionName && it.returnType.classifier == Boolean::class }
        ?: throw Exception("Class '${model::class.simpleName}' doesn't have a function '$functionName'")
    val dependentValue = function.call(model) as Boolean
    if (dependentValue)
    {
        return checkMissing(value, name)
    }
    return null
}

fun checkMissing(value: Any?, name: String): ErrorInfo?
{
    if (value == null)
    {
        return ErrorInfo(
                "invalid-field:$name:missing",
                "You have not supplied a value, or have supplied a null value, for field '$name'"
        )
    }
    return null
}