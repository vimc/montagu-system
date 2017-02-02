package uk.ac.imperial.vimc.demo.app.serialization

import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import java.lang.reflect.Type

class RangeSerializer : JsonSerializer<IntRange> {
    override fun serialize(range: IntRange, typeOfSrc: Type, context: JsonSerializationContext): JsonElement {
        return JsonObject().apply {
            addProperty("start", range.first)
            addProperty("end", range.last)
        }
    }
}