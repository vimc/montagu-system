package org.vaccineimpact.api.tests.serialization

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Before
import org.junit.Test
import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.UnknownEnumValue
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.test_helpers.MontaguTests

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
}