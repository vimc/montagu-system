package org.vaccineimpact.api.serialization

import com.github.salomonbrys.kotson.SerializerArg
import com.github.salomonbrys.kotson.jsonSerializer
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.TypeAdapter
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonWriter
import org.vaccineimpact.api.models.BurdenEstimateDataPoint
import org.vaccineimpact.api.models.BurdenEstimateDataSeries
import org.vaccineimpact.api.models.BurdenEstimateGrouping
import org.vaccineimpact.api.models.helpers.Rule
import org.vaccineimpact.api.models.helpers.SerializationRule
import kotlin.reflect.KProperty1
import kotlin.reflect.full.memberProperties

inline fun <reified T : Any> ruleBasedSerializer(baseGson: Gson) = jsonSerializer<T> {
    val json = baseGson.toJsonTree(it.src) as JsonObject
    applyRules(it, json)
    json
}

inline fun <reified T : Any> applyRules(it: SerializerArg<T>, json: JsonObject)
{
    for (property in T::class.memberProperties)
    {
        val rules = property.annotations.filterIsInstance<SerializationRule>().map { it.rule }
        for (rule in rules)
        {
            when (rule)
            {
                Rule.EXCLUDE_IF_NULL -> removeFieldIfNull(it.src, json, property)
            }
        }
    }
}

fun <T> removeFieldIfNull(original: T, json: JsonObject,
                          property: KProperty1<T, Any?>,
                          serializer: Serializer = MontaguSerializer.instance)
{
    if (property.get(original) == null)
    {
        json.remove(serializer.convertFieldName(property.name))
    }
}

class BurdenEstimateDataSeriesTypeAdaptor : TypeAdapter<BurdenEstimateDataSeries>()
{
    override fun read(reader: JsonReader): BurdenEstimateDataSeries
    {
        throw UnsupportedOperationException("This class can only be used for serializing")
    }

    override fun write(writer: JsonWriter, series: BurdenEstimateDataSeries)
    {
        writer.beginObject()
        val dataPointAdaptor = DataPointAdaptor(series.burdenEstimateGrouping)
        val keys = series.data.keys
        for (key in keys)
        {
            writer.name(key.toString())
            writer.beginArray()
            val data = series.data[key]!!
            for (point in data)
            {
                dataPointAdaptor.write(writer, point)
            }
            writer.endArray()
        }
        writer.endObject()
    }
}

class DataPointAdaptor(private val groupBy: BurdenEstimateGrouping) : TypeAdapter<BurdenEstimateDataPoint>()
{
    override fun read(reader: JsonReader): BurdenEstimateDataPoint
    {
        throw UnsupportedOperationException("This class can only be used for serializing")
    }

    override fun write(writer: JsonWriter, value: BurdenEstimateDataPoint)
    {
        val x = if (groupBy == BurdenEstimateGrouping.YEAR)
        {
            value.age
        }
        else
        {
            value.year
        }
        writer.beginObject()
        writer.name("x")
        writer.value(x)
        writer.name("y")
        writer.value(value.value);
        writer.endObject()
    }

}