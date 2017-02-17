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
            addProperty(Outcome.Keys.deaths, it.src.deaths)
            addProperty(Outcome.Keys.cases, it.src.cases)
            addProperty(Outcome.Keys.dalys, it.src.dalys)
            addProperty(Outcome.Keys.fvps, it.src.fvps)
            addProperty(Outcome.Keys.deathsAverted, it.src.deathsAverted)
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