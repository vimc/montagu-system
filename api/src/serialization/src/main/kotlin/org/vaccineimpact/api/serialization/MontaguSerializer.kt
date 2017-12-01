package org.vaccineimpact.api.serialization

import com.github.salomonbrys.kotson.*
import com.google.gson.*
import org.vaccineimpact.api.models.*
import java.lang.reflect.Type
import java.time.Instant
import java.time.LocalDate

interface Serializer
{
    fun toResult(data: Any?): String
    fun toJson(result: Result): String
    fun <T> fromJson(json: String, klass: Class<T>): T
    fun convertFieldName(name: String): String

    fun serializeEnum(value: Any): String

    fun serializeValueForCSV(value: Any?): String

    val gson: Gson
}

class MontaguSerializer : Serializer
{
    private val toDateStringSerializer = jsonSerializer<Any> {
        JsonPrimitive(it.src.toString())
    }

    companion object
    {
        val instance: Serializer = MontaguSerializer()
        const val noValue = "<NA>"
    }

    override val gson: Gson

    init
    {
        val common = GsonBuilder()
                .setPrettyPrinting()
                .disableHtmlEscaping()
                .setFieldNamingStrategy { convertFieldName(it.name) }
                .serializeNulls()

                .registerTypeAdapter<Instant>(toDateStringSerializer)
                .registerTypeAdapter<LocalDate>(toDateStringSerializer)

                .registerEnum<ActivityType>()
                .registerEnum<BurdenEstimateSetStatus>()
                .registerEnum<BurdenEstimateSetTypeCode>()
                .registerEnum<GAVISupportLevel>()
                .registerEnum<ResponsibilitySetStatus>()
                .registerEnum<ResponsibilityStatus>()
                .registerEnum<ResultStatus>()
                .registerEnum<TouchstoneStatus>()

        // Some serializers for complex objects need to recurse back to the default
        // serialization strategy. So we separate out a Gson object that has all the
        // primitive serializers, and then create one that extends it with the complex
        // serializers.
        val baseGson = common.create()
        gson = common
                .registerTypeAdapter<User>(ruleBasedSerializer(baseGson))
                .create()
    }

    override fun toResult(data: Any?): String = toJson(Result(ResultStatus.SUCCESS, data, emptyList()))
    override fun toJson(result: Result): String = gson.toJson(result)
    override fun <T> fromJson(json: String, klass: Class<T>): T = gson.fromJson(json, klass)

    override fun convertFieldName(name: String): String
    {
        val builder = StringBuilder()
        for (char in name)
        {
            if (char.isUpperCase())
            {
                builder.append("_" + char.toLowerCase())
            }
            else
            {
                builder.append(char)
            }
        }
        return builder.toString().trim('_')
    }
    override fun serializeEnum(value: Any): String
    {
        val text = when (value)
        {
            is GAVISupportLevel -> mapGAVISupportLevel(value)
            else -> value.toString()
        }
        return text.toLowerCase().replace('_', '-')
    }

    override fun serializeValueForCSV(value: Any?) = when (value)
    {
        null -> noValue
        is Enum<*> -> serializeEnum(value)
        else -> value.toString()
    }

    private fun mapGAVISupportLevel(value: GAVISupportLevel): String
    {
        return when (value)
        {
            GAVISupportLevel.NONE -> "no vaccine"
            GAVISupportLevel.WITHOUT -> "no gavi"
            GAVISupportLevel.WITH -> "total"
        // Legacy values
            GAVISupportLevel.BESTMINUS -> "best minus"
            GAVISupportLevel.HOLD2010 -> "hold 2010"
        }
    }

    private inline fun <reified T: Enum<T>> GsonBuilder.registerEnum(): GsonBuilder
    {
        return this.registerTypeAdapter<T> {
            serialize { JsonPrimitive(serializeEnum(it.src)) }
            deserialize { Deserializer().parseEnum<T>(it.json.asString) }
        }
    }
}