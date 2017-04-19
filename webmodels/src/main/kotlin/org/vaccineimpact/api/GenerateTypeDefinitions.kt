package org.vaccineimpact.api

import me.ntrrgc.tsGenerator.ClassTransformer
import me.ntrrgc.tsGenerator.TypeScriptGenerator
import me.ntrrgc.tsGenerator.camelCaseToSnakeCase
import org.vaccineimpact.api.models.*
import java.io.File
import java.time.LocalDate
import java.time.LocalDateTime
import kotlin.reflect.KClass
import kotlin.reflect.KProperty

fun main(args: Array<String>)
{
    val outputPath = "../../main/Models.ts"

    val generator = TypeScriptGenerator(
            rootClasses = setOf(
                    Scenario::class,
                    TouchstoneStatus::class,
                    Touchstone::class,
                    ModellingGroup::class,
                    Responsibilities::class,
                    Result::class
            ),
            mappings = mapOf(
                    LocalDateTime::class to "Date",
                    LocalDate::class to "Date"
            ),
            ignoreSuperclasses = setOf(Iterable::class, HasKey::class),
            classTransformers = listOf(MyClassTransformer),
            addExportStatements = true,
            enumTransformer = { klass, value -> value.toString().toLowerCase().replace('_', '-') }
    )
    File(outputPath).writeText(generator.definitionsText)
}

object MyClassTransformer : ClassTransformer
{
    override fun transformPropertyName(propertyName: String, property: KProperty<*>, klass: KClass<*>): String
    {
        return camelCaseToSnakeCase(propertyName)
    }
}