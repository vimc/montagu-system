package uk.ac.imperial.vimc.demo.app

import com.github.salomonbrys.kotson.jsonSerializer
import com.github.salomonbrys.kotson.registerTypeAdapter
import com.google.gson.*
import uk.ac.imperial.vimc.demo.app.models.Outcome

object Serializer
{
    val toStringSerializer = jsonSerializer<Any> { JsonPrimitive(it.src.toString()) }
    val rangeSerializer = jsonSerializer<IntRange> {
        JsonObject().apply {
            addProperty("start", it.src.first)
            addProperty("end", it.src.last)
        }
    }
    val outcomeSerializer = jsonSerializer<Outcome> {
        JsonObject().apply {
            addProperty("year", it.src.year)
            addProperty("Deaths", it.src.numberOfDeaths)
            addProperty("Cases", it.src.cases)
            addProperty("DALYs", it.src.dalys)
            addProperty("FVPs", it.src.fvps)
            addProperty("Deaths Averted", it.src.deathsAverted)
        }
    }

    val gson: Gson = GsonBuilder()
            .setPrettyPrinting()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .registerTypeAdapter<java.time.LocalDate>(toStringSerializer)
            .registerTypeAdapter<java.time.Instant>(toStringSerializer)
            .registerTypeAdapter(rangeSerializer)
            .registerTypeAdapter(outcomeSerializer)
            .create()
}