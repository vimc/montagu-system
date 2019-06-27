package org.vaccineimpact.api.serialization

import java.math.BigDecimal
import java.text.DecimalFormat
import org.vaccineimpact.api.serialization.MontaguSerializer

open class DecimalRoundingSerializer : MontaguSerializer()
{
    companion object
    {
        val instance: Serializer = DecimalRoundingSerializer()
    }

    private val decimalFormat = DecimalFormat("###.##")

    private fun serializeBigDecimal(value: BigDecimal) : String
    {
        return decimalFormat.format(value)
    }

    override fun serializeValueForCSV(value: Any?) = when (value)
    {
        is BigDecimal -> serializeBigDecimal(value)
        else -> super.serializeValueForCSV(value)
    }

}