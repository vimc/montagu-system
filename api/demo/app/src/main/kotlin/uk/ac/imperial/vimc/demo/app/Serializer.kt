package uk.ac.imperial.vimc.demo.app

import com.github.salomonbrys.kotson.jsonSerializer
import com.github.salomonbrys.kotson.registerTypeAdapter
import com.google.gson.*

object Serializer {
    val toStringSerializer = jsonSerializer<Any> { JsonPrimitive(it.src.toString()) }
    val rangeSerializer = jsonSerializer<IntRange> {
        JsonObject().apply {
            addProperty("start", it.src.first)
            addProperty("end", it.src.last)
        }
    }

    val gson: Gson = GsonBuilder()
            .setPrettyPrinting()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .registerTypeAdapter<java.time.LocalDate>(toStringSerializer)
            .registerTypeAdapter<java.time.Instant>(toStringSerializer)
            .registerTypeAdapter(rangeSerializer)
            .create()
}