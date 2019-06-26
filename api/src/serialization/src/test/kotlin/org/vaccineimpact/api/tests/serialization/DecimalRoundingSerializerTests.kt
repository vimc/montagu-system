package org.vaccineimpact.api.tests.serialization

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.serialization.DecimalRoundingSerializer
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.math.BigDecimal

class DecimalRoundingSerializerTests : MontaguTests()
{
    private val serializer = DecimalRoundingSerializer.instance

    @Test
    fun `serializes decimal for CSV with correct decimal places`()
    {
        Assertions.assertThat(serializer.serializeValueForCSV(BigDecimal(123))).isEqualTo("123")
        Assertions.assertThat(serializer.serializeValueForCSV(BigDecimal(123.4))).isEqualTo("123.4")
        Assertions.assertThat(serializer.serializeValueForCSV(BigDecimal(123.45))).isEqualTo("123.45")
        Assertions.assertThat(serializer.serializeValueForCSV(BigDecimal(123.456))).isEqualTo("123.46")
        Assertions.assertThat(serializer.serializeValueForCSV(BigDecimal(123.5000000))).isEqualTo("123.5")
    }

}