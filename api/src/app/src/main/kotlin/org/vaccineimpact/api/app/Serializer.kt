package org.vaccineimpact.api.app

import com.github.salomonbrys.kotson.jsonSerializer
import com.github.salomonbrys.kotson.registerTypeAdapter
import com.google.gson.*
import org.vaccineimpact.api.app.models.ResponsibilitySetStatus
import org.vaccineimpact.api.app.models.ResponsibilityStatus
import org.vaccineimpact.api.app.models.Result
import org.vaccineimpact.api.app.models.ResultStatus

object Serializer
{
    private val toStringSerializer = jsonSerializer<Any> { JsonPrimitive(it.src.toString()) }
    private val rangeSerializer = jsonSerializer<IntRange> {
        JsonObject().apply {
            addProperty("start", it.src.first)
            addProperty("end", it.src.last)
        }
    }
    private val enumSerializer = jsonSerializer<Any> {
        JsonPrimitive(it.src.toString().toLowerCase())
    }

    val gson: Gson = GsonBuilder()
            .setPrettyPrinting()
            .disableHtmlEscaping()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .serializeNulls()
            .registerTypeAdapter<java.time.LocalDate>(toStringSerializer)
            .registerTypeAdapter<java.time.Instant>(toStringSerializer)
            .registerTypeAdapter(rangeSerializer)
            .registerTypeAdapter<ResultStatus>(enumSerializer)
            .registerTypeAdapter<ResponsibilitySetStatus>(enumSerializer)
            .registerTypeAdapter<ResponsibilityStatus>(enumSerializer)
            .create()

    fun toResult(data: Any?): String = toJson(Result(ResultStatus.SUCCESS, data, emptyList()))
    fun toJson(result: Result): String = Serializer.gson.toJson(result)
}