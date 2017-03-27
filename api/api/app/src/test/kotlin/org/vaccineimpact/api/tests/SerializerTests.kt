package org.vaccineimpact.api.tests

import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import com.beust.klaxon.json
import org.junit.Assert.assertEquals
import org.junit.Test
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.app.models.ErrorInfo
import org.vaccineimpact.api.app.models.Result
import org.vaccineimpact.api.app.models.ResultStatus
import java.time.LocalDate
import java.time.Month
import java.time.ZoneId

class SerializerTests
{
    @Test
    fun `can serialize LocalDate`()
    {
        val actual = LocalDate.of(1988, Month.MARCH, 19)
        val expected = "\"1988-03-19\""
        checkSerializedForm(expected, actual)
    }

    @Test
    fun `can serialize Instant`()
    {
        val actual = LocalDate.of(1, Month.DECEMBER, 25)
                .atStartOfDay(ZoneId.of("UTC"))
                .toInstant()
        val expected = "\"0001-12-25T00:00:00Z\""
        checkSerializedForm(expected, actual)
    }

    @Test
    fun `can serialize IntRange`()
    {
        val actual = 1..6
        val expected = json {
            obj("start" to 1, "end" to 6)
        }
        checkSerializedForm(expected, actual)
    }

    @Test
    fun `can serialize Enum`()
    {
        val actual = ResultStatus.SUCCESS
        val expected = "\"success\""
        checkSerializedForm(expected, actual)
    }

    @Test
    fun `toResult wraps object in successful Result`()
    {
        val data = 31415
        val actual = Serializer.toResult(data)
        val expected = json {
            obj(
                    "data" to 31415,
                    "errors" to array(),
                    "status" to "success"
            )
        }
        assertEquals(expected, parse(actual))
    }

    @Test
    fun `toJson serializes Result correctly`()
    {
        val result = Result(
                ResultStatus.FAILURE,
                31415,
                listOf(ErrorInfo("code", "message"))
        )
        val actual = Serializer.toJson(result)
        val expected = json {
            obj(
                    "data" to 31415,
                    "errors" to array(obj("code" to "code", "message" to "message")),
                    "status" to "failure"
            )
        }
        assertEquals(expected, parse(actual))
    }

    fun checkSerializedForm(expected: JsonObject, actual: Any): Unit {
        val expectedAsString = expected.toJsonString(prettyPrint = true)
        checkSerializedForm(expectedAsString, actual)
    }
    fun checkSerializedForm(expected: String, actual: Any): Unit {
        val actualAsString = Serializer.gson.toJson(actual)
        assertEquals(expected, actualAsString)
    }

    fun parse(string: String): JsonObject = Parser().parse(StringBuilder(string)) as JsonObject
}