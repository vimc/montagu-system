package org.vaccineimpact.api.models.helpers

@Target(AnnotationTarget.PROPERTY)
annotation class SerializationRule(val rule: Rule)

enum class Rule
{
    EXCLUDE_IF_NULL
}

annotation class AllColumnsRequired