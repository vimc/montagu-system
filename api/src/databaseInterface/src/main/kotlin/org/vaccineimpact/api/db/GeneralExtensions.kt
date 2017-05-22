package org.vaccineimpact.api.db

import java.math.BigDecimal
import java.util.*

fun <T> T.getOther(a: T, b: T) = when (this)
{
    a -> b
    b -> a
    else -> throw IllegalArgumentException("The given object '$this' was neither '$a' not '$b'")
}

fun Random.nextDecimal(min: Int = 0, max: Int = 1, numberOfDecimalPlaces: Int = 2): BigDecimal
{
    val range = max - min
    val factor = Math.pow(10.0, numberOfDecimalPlaces.toDouble()).toInt()
    val int = this.nextInt(range * factor)
    return BigDecimal(int) / BigDecimal(factor)
}