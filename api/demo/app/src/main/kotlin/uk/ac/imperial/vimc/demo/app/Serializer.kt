package uk.ac.imperial.vimc.demo.app

import com.github.salomonbrys.kotson.jsonSerializer
import com.github.salomonbrys.kotson.registerTypeAdapter
import com.google.gson.*
import uk.ac.imperial.vimc.demo.app.models.Outcome
import uk.ac.imperial.vimc.demo.app.models.Result
import uk.ac.imperial.vimc.demo.app.models.ResultStatus

object Serializer
{
    private val toStringSerializer = jsonSerializer<Any> { JsonPrimitive(it.src.toString()) }
    private val rangeSerializer = jsonSerializer<IntRange> {
        JsonObject().apply {
            addProperty("start", it.src.first)
            addProperty("end", it.src.last)
        }
    }
    private val outcomeSerializer = jsonSerializer<Outcome> {
        JsonObject().apply {
            addProperty("year", it.src.year)
            addProperty("Deaths", it.src.numberOfDeaths)
            addProperty("Cases", it.src.cases)
            addProperty("DALYs", it.src.dalys)
            addProperty("FVPs", it.src.fvps)
            addProperty("Deaths Averted", it.src.deathsAverted)
        }
    }
    private val enumSerializer = jsonSerializer<Any> {
        JsonPrimitive(it.src.toString().toLowerCase())
    }

    val gson: Gson = GsonBuilder()
            .setPrettyPrinting()
            .disableHtmlEscaping()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .registerTypeAdapter<java.time.LocalDate>(toStringSerializer)
            .registerTypeAdapter<java.time.Instant>(toStringSerializer)
            .registerTypeAdapter(rangeSerializer)
            .registerTypeAdapter(outcomeSerializer)
            .registerTypeAdapter<ResultStatus>(enumSerializer)
            .create()

    fun toResult(data: Any?): String = toJson(Result(ResultStatus.SUCCESS, data, emptyList()))
    fun toJson(result: Result): String = Serializer.gson.toJson(result)
}