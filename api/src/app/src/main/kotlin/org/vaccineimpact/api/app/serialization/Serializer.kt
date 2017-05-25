package org.vaccineimpact.api.app.serialization

import com.github.salomonbrys.kotson.jsonSerializer
import com.github.salomonbrys.kotson.registerTypeAdapter
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonPrimitive
import org.vaccineimpact.api.models.*

open class Serializer
{
    companion object
    {
        val instance = Serializer()
    }

    private val toStringSerializer = jsonSerializer<Any> { JsonPrimitive(it.src.toString()) }
    private val enumSerializer = jsonSerializer<Any> { JsonPrimitive(serializeEnum(it.src)) }
    val gson: Gson = GsonBuilder()
            .setPrettyPrinting()
            .disableHtmlEscaping()
            .setFieldNamingStrategy { convertFieldName(it.name) }
            .serializeNulls()
            .registerTypeAdapter<java.time.LocalDate>(toStringSerializer)
            .registerTypeAdapter<java.time.Instant>(toStringSerializer)
            .registerTypeAdapter<ResultStatus>(enumSerializer)
            .registerTypeAdapter<ResponsibilitySetStatus>(enumSerializer)
            .registerTypeAdapter<ResponsibilityStatus>(enumSerializer)
            .registerTypeAdapter<TouchstoneStatus>(enumSerializer)
            .registerTypeAdapter<GAVISupportLevel>(enumSerializer)
            .registerTypeAdapter<ActivityType>(enumSerializer)
            .create()

    open fun toResult(data: Any?): String = toJson(Result(ResultStatus.SUCCESS, data, emptyList()))
    open fun toJson(result: Result): String = gson.toJson(result)

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
    fun serializeEnum(value: Any) = value.toString().toLowerCase().replace('_', '-')
}