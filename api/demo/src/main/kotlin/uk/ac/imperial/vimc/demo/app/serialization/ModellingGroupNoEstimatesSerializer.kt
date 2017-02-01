package uk.ac.imperial.vimc.demo.app.serialization

import com.google.gson.JsonObject
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup
import java.lang.reflect.Type

class ModellingGroupNoEstimatesSerializer : JsonSerializer<ModellingGroup> {
    override fun serialize(group: ModellingGroup, typeOfSrc: Type, context: JsonSerializationContext) = JsonObject().apply {
        addProperty("id", group.id)
        addProperty("description", group.description)
    }
}