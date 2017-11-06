package org.vaccineimpact.api.serialization.validation

import org.vaccineimpact.api.models.ErrorInfo

annotation class CanBeBlank
annotation class AllowedFormat(val pattern: String, val example: String)
annotation class MinimumLength(val length: Int)

fun applyRule(annotation: Annotation, value: Any?, fieldName: String): ErrorInfo? =
        when (annotation)
        {
            is AllowedFormat -> checkFormat(annotation, value, fieldName)
            is MinimumLength -> checkLength(annotation, value, fieldName)
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