package uk.ac.imperial.vimc.demo.app.serialization

import com.google.gson.JsonPrimitive
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import uk.ac.imperial.vimc.demo.app.models.Scenario
import java.lang.reflect.Type

class ScenarioIdSerializer : JsonSerializer<Scenario> {
    override fun serialize(scenario: Scenario, typeOfSrc: Type, context: JsonSerializationContext) = JsonPrimitive(scenario.id)
}