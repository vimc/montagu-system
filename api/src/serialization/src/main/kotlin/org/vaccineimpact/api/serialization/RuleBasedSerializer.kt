package org.vaccineimpact.api.serialization

import com.github.salomonbrys.kotson.SerializerArg
import com.github.salomonbrys.kotson.jsonSerializer
import com.google.gson.Gson
import com.google.gson.JsonObject
import org.vaccineimpact.api.models.helpers.Rule
import org.vaccineimpact.api.models.helpers.SerializationRule
import kotlin.reflect.KProperty1
import kotlin.reflect.full.memberProperties

inline fun <reified T : Any> ruleBasedSerializer(baseGson: Gson) = jsonSerializer<T> {
    val json = baseGson.toJsonTree(it.src) as JsonObject
    applyRules(it, json)
    json
}

inline fun <reified T : Any> applyRules(it: SerializerArg<T>, json: JsonObject)
{
    for (property in T::class.memberProperties)
    {
        val rules = property.annotations.filterIsInstance<SerializationRule>().map { it.rule }
        for (rule in rules)
        {
            when (rule)
            {
                Rule.EXCLUDE_IF_NULL -> removeFieldIfNull(it.src, json, property)
            }
        }
    }
}

fun <T> removeFieldIfNull(original: T, json: JsonObject, property: KProperty1<T, Any?>)
{
    if (property.get(original) == null)
    {
        json.remove(MontaguSerializer().convertFieldName(property.name))
    }
}