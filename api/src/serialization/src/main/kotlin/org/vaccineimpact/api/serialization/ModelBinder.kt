package org.vaccineimpact.api.serialization

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.validation.CanBeBlank
import org.vaccineimpact.api.serialization.validation.ValidationException
import org.vaccineimpact.api.serialization.validation.Validator
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

class ModelBinder(private val serializer: Serializer = MontaguSerializer.instance,
                  private val validator: Validator = Validator(serializer))
{
    fun <T : Any> deserialize(body: String, klass: Class<T>): T
    {
        val model = serializer.fromJson(preprocessed(body), klass)
        val errors = verify(model)
        if (errors.any())
        {
            throw ValidationException(errors.distinct())
        }
        return model
    }

    fun verify(model: Any): List<ErrorInfo>
    {
        val properties = model::class.memberProperties.filterIsInstance<KProperty1<Any, *>>()
                .sortedBy { it.returnType.isMarkedNullable }
        return properties.flatMap { verify(it, model) }
    }

    fun verify(property: KProperty1<Any, *>, model: Any): List<ErrorInfo>
    {
        @Suppress("UNCHECKED_CAST")
        val klass = model::class as KClass<Any>
        val errors = mutableListOf<ErrorInfo>()
        val name = serializer.convertFieldName(property.name)
        val value = property.get(model)

        errors += validator.recursiveNullCheck(property, model, name) ?: listOf()

        if (value is String && value.isBlank() && property.findAnnotationAnywhere<CanBeBlank>(klass) == null)
        {
            errors += ErrorInfo(
                    "invalid-field:$name:blank",
                    "You have supplied an empty or blank string for field '$name'"
            )
        }
        errors += property.allAnnotations(klass).flatMap { validator.applyRule(it, property, name, model) }
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