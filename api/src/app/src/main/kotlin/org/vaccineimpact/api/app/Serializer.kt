package org.vaccineimpact.api.app

import com.github.salomonbrys.kotson.jsonSerializer
import com.github.salomonbrys.kotson.registerTypeAdapter
import com.google.gson.FieldNamingPolicy
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonPrimitive
import org.vaccineimpact.api.models.*

object Serializer
{
    private val toStringSerializer = jsonSerializer<Any> { JsonPrimitive(it.src.toString()) }
    private val enumSerializer = jsonSerializer<Any> {
        JsonPrimitive(it.src.toString().toLowerCase().replace('_', '-'))
    }

    val gson: Gson = GsonBuilder()
            .setPrettyPrinting()
            .disableHtmlEscaping()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
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

    fun toResult(data: Any?): String = toJson(Result(ResultStatus.SUCCESS, data, emptyList()))
    fun toJson(result: Result): String = Serializer.gson.toJson(result)
}