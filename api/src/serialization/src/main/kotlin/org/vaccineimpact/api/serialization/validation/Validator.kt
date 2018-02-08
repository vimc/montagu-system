package org.vaccineimpact.api.serialization.validation

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.validation.AllowedFormat
import org.vaccineimpact.api.models.validation.MinimumLength
import org.vaccineimpact.api.models.validation.RequiredWhen
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import java.lang.reflect.InvocationTargetException
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.memberFunctions
import kotlin.reflect.full.memberProperties

class Validator(private val serializer: Serializer = MontaguSerializer.instance)
{
    fun applyRule(annotation: Annotation, value: Any?, fieldName: String, model: Any)
            : List<ErrorInfo>
    {
        return when (annotation)
        {
            is AllowedFormat -> checkFormat(annotation, value, fieldName, model)
            is MinimumLength -> checkLength(annotation, value, fieldName, model)
            is RequiredWhen -> checkRequiredWhen(annotation, value, fieldName, model)
            else -> listOf()
        }
    }

    fun checkBlank(value: Any?, name: String, model: Any): List<ErrorInfo>
    {
        if (value is String && value.isBlank())
        {
            return listOf(ErrorInfo(
                    "${invalidFieldCode(model, name)}:blank",
                    "You have supplied an empty or blank string for field '$name'"
            ))
        }

        return listOf()
    }

    fun checkNull(value: Any?, property: KProperty1<Any, *>, model: Any, name: String): List<ErrorInfo>
    {
        if (value != null || property.returnType.isMarkedNullable)
            return listOf()

        return missingFieldError(name, model)
    }

    private fun missingFieldError(name: String, model:Any): List<ErrorInfo>
    {
        return listOf(ErrorInfo(
                "${invalidFieldCode(model, name)}:missing",
                "You have not supplied a value, or have supplied a null value, for field '$name'"
        ))
    }

    private fun checkFormat(format: AllowedFormat, value: Any?, name: String, model: Any): List<ErrorInfo>
    {
        if (value is String && !value.isBlank())
        {
            val regex = Regex(format.pattern)
            if (!regex.matches(value))
            {
                return listOf(ErrorInfo(
                        "${invalidFieldCode(model, name)}:bad-format",
                        "The '$name' field must be in the form '${format.example}'"
                ))
            }
        }
        return listOf()
    }

    private fun checkLength(length: MinimumLength, value: Any?, name: String, model: Any): List<ErrorInfo>
    {
        if (value is String && !value.isBlank())
        {
            if (value.length < length.length)
            {
                return listOf(ErrorInfo(
                        "${invalidFieldCode(model, name)}:too-short",
                        "The '$name' field must be at least ${length.length} characters long"
                ))
            }
        }
        return listOf()
    }

    private fun invalidFieldCode(model: Any, propertyName: String): String
            = "invalid-field:${serializer.convertFieldName(model.javaClass.simpleName)}:$propertyName"


    private fun checkRequiredWhen(requiredWhen: RequiredWhen, value: Any?, name: String, model: Any): List<ErrorInfo>
    {
        val functionName = requiredWhen.functionName
        val functions = model::class.memberFunctions
        val function = functions.singleOrNull { it.name == functionName && it.returnType.classifier == Boolean::class }
                ?: throw Exception("Class '${model::class.simpleName}' doesn't have a function '$functionName'")

        try
        {
            if (function.call(model) as Boolean)
            {
                return checkMissing(value, model, name)
            }

            return listOf()
        }
        catch(e: InvocationTargetException)
        {
            return listOf()
        }
    }

    private fun checkMissing(value: Any?, model: Any, name: String): List<ErrorInfo>
    {
        value ?: return missingFieldError(name, model)
        return listOf()
    }
}