package org.vaccineimpact.api.serialization

import com.github.salomonbrys.kotson.jsonSerializer
import com.github.salomonbrys.kotson.registerTypeAdapter
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonPrimitive
import org.vaccineimpact.api.models.*
import java.time.Instant
import java.time.LocalDate

open class Serializer
{
    companion object
    {
        val instance = Serializer()
        const val noValue = "<NA>"
    }

    private val toDateStringSerializer = jsonSerializer<Any> {
        JsonPrimitive(it.src.toString())
    }
    private val enumSerializer = jsonSerializer<Any> { JsonPrimitive(serializeEnum(it.src)) }

    val gson: Gson

    init
    {
        val common = GsonBuilder()
                .setPrettyPrinting()
                .disableHtmlEscaping()
                .setFieldNamingStrategy { convertFieldName(it.name) }
                .serializeNulls()
                .registerTypeAdapter<LocalDate>(toDateStringSerializer)
                .registerTypeAdapter<Instant>(toDateStringSerializer)
                .registerTypeAdapter<ResultStatus>(enumSerializer)
                .registerTypeAdapter<ResponsibilitySetStatus>(enumSerializer)
                .registerTypeAdapter<ResponsibilityStatus>(enumSerializer)
                .registerTypeAdapter<TouchstoneStatus>(enumSerializer)
                .registerTypeAdapter<GAVISupportLevel>(enumSerializer)
                .registerTypeAdapter<ActivityType>(enumSerializer)

        // Some serializers for complex objects need to recurse back to the default
        // serialization strategy. So we separate out a Gson object that has all the
        // primitive serializers, and then create one that extends it with the complex
        // serializers.
        val baseGson = common.create()
        gson = common
                .registerTypeAdapter<User>(ruleBasedSerializer(baseGson))
                .create()
    }

    open fun toResult(data: Any?): String = toJson(Result(ResultStatus.SUCCESS, data, emptyList()))
    open fun toJson(result: Result): String = gson.toJson(result)
    fun <T> fromJson(json: String, klass: Class<T>): T = gson.fromJson(json, klass)

    fun convertFieldName(name: String): String
    {
        val builder = StringBuilder()
        for (char in name)
        {
            if (char.isUpperCase())
            {
                builder.append("_" + char.toLowerCase())
            }
            else
            {
                builder.append(char)
            }
        }
        return builder.toString().trim('_')
    }
    fun serializeEnum(value: Any): String
    {
        val text = when (value)
        {
            is GAVISupportLevel -> mapGAVISupportLevel(value)
            else -> value.toString()
        }
        return text.toLowerCase().replace('_', '-')
    }

    fun serializeValueForCSV(value: Any?) = when (value)
    {
        null -> noValue
        is Enum<*> -> serializeEnum(value)
        else -> value.toString()
    }

    private fun mapGAVISupportLevel(value: GAVISupportLevel): String
    {
        return when (value)
        {
            GAVISupportLevel.NONE -> "no vaccine"
            GAVISupportLevel.WITHOUT -> "no gavi"
            GAVISupportLevel.WITH -> "total"
            // Legacy values
            GAVISupportLevel.BESTMINUS -> "best minus"
            GAVISupportLevel.HOLD2010 -> "hold 2010"
        }
    }
}