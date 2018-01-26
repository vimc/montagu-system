package org.vaccineimpact.api.serialization

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.validation.CanBeBlank
import org.vaccineimpact.api.serialization.validation.ValidationException
import org.vaccineimpact.api.serialization.validation.applyRule
import org.vaccineimpact.api.serialization.validation.checkMissing
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

class ModelBinder(private val serializer: Serializer = MontaguSerializer.instance)
{
    fun <T : Any> deserialize(body: String, klass: Class<T>): T
    {
        val model = serializer.fromJson(preprocessed(body), klass)
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
        val name = serializer.convertFieldName(property.name)
        val value = property.get(model)

        if (!property.returnType.isMarkedNullable)
        {
            errors += listOfNotNull(checkMissing(value, name))
        }
        if (value is String && value.isBlank() && property.findAnnotationAnywhere<CanBeBlank>(klass) == null)
        {
            errors += ErrorInfo(
                    "invalid-field:$name:blank",
                    "You have supplied an empty or blank string for field '$name'"
            )
        }
        errors += property.allAnnotations(klass).map { applyRule(it, value, name, model) }.filterNotNull()
        return errors
    }

    private fun preprocessed(body: String) = if (body.isBlank())
    {
        "{}"
    }
    else
    {
        body
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