package org.vaccineimpact.api.serialization

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.serialization.validation.CanBeBlank
import org.vaccineimpact.api.serialization.validation.ValidationException
import org.vaccineimpact.api.serialization.validation.applyRule
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

class ModelBinder
{
    fun <T : Any> deserialize(body: String, klass: Class<T>): T
    {
        val model = MontaguSerializer.instance.fromJson(body, klass)
        val errors = verify(model)
        if (errors.any())
        {
            throw ValidationException(errors)
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
        @Suppress("UNCHECKED_CAST")
        val klass = model::class as KClass<Any>
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
        if (value is String && value.isBlank() && property.findAnnotationAnywhere<CanBeBlank>(klass) == null)
        {
            errors += ErrorInfo(
                    "invalid-field:$name:blank",
                    "You have supplied an empty or blank string for field '$name'"
            )
        }
        errors += property.allAnnotations(klass).map { applyRule(it, value, name) }.filterNotNull()
        return errors
    }

    private inline fun <reified TAnnotation : Annotation>
            KProperty1<Any, *>.findAnnotationAnywhere(klass: KClass<Any>): TAnnotation?
    {
        return findAnnotation()
                ?: matchingConstructorParameter(klass)?.findAnnotation()
    }

    private fun KProperty1<Any, *>.allAnnotations(klass: KClass<Any>): List<Annotation> =
            this.annotations + (this.matchingConstructorParameter(klass)?.annotations ?: emptyList())

    private fun KProperty1<Any, *>.matchingConstructorParameter(klass: KClass<Any>) =
            klass.constructors
                    .flatMap { it.parameters }
                    .singleOrNull { it.name == name }
}