package org.vaccineimpact.api.tests.serialization

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.assertj.core.api.Condition
import org.junit.Before
import org.junit.Test
import org.vaccineimpact.api.serialization.Deserializer
import org.vaccineimpact.api.serialization.UnknownEnumValue
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.serialization.validation.ValidationException
import org.vaccineimpact.api.test_helpers.MontaguTests
import kotlin.reflect.full.createType
import java.util.function.Predicate

class DeserializerTests : MontaguTests()
{
    lateinit var deserializer: Deserializer

    @Before
    fun createDeserializer()
    {
        deserializer = Deserializer()
    }

    @Test
    fun `can parse enum`()
    {
        assertThat(deserializer.parseEnum<TouchstoneStatus>("open"))
                .isEqualTo(TouchstoneStatus.OPEN)
    }

    @Test
    fun `can parse enum with hyphens`()
    {
        assertThat(deserializer.parseEnum<TouchstoneStatus>("in-preparation"))
                .isEqualTo(TouchstoneStatus.IN_PREPARATION)
    }

    @Test
    fun `parseEnum throws exception if value is unrecognized`()
    {
        assertThatThrownBy { deserializer.parseEnum<TouchstoneStatus>("bad-value") }
                .isInstanceOf(UnknownEnumValue::class.java)
    }

    @Test
    fun `can parse Boolean`()
    {
        assertThat(deserializer.deserialize("true", Boolean::class.createType())).isEqualTo(true)
        assertThat(deserializer.deserialize("True", Boolean::class.createType())).isEqualTo(true)

        assertThat(deserializer.deserialize("false", Boolean::class.createType())).isEqualTo(false)
        assertThat(deserializer.deserialize("FALSE", Boolean::class.createType())).isEqualTo(false)
    }

    @Test
    fun `throws exception on invalid Boolean`()
    {
        val exceptionCondition =  Condition<Throwable>(
                Predicate<Throwable> { e: Throwable ->
                    val ve = e as ValidationException
                    ve.errors.count() == 1 && ve.errors[0].code == "invalid-boolean"
                            && ve.errors[0].message == "Unable to parse '123' as Boolean"
                }, "exceptionCondition")

        assertThatThrownBy {
            deserializer.deserialize("123", Boolean::class.createType())
        }.has(exceptionCondition)
    }
}
