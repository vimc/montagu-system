package org.vaccineimpact.api.db

import java.math.BigDecimal
import java.util.*
import kotlin.math.pow

fun <T> T.getOther(a: T, b: T) = when (this)
{
    a -> b
    b -> a
    else -> throw IllegalArgumentException("The given object '$this' was neither '$a' not '$b'")
}

fun Random.nextDecimal(min: Int = 0, max: Int = 1, numberOfDecimalPlaces: Int = 2): BigDecimal
{
    val range = max - min
    val factor = 10.0.pow(numberOfDecimalPlaces.toDouble())
    val int = this.nextInt(range * factor.toInt())
    return BigDecimal(int).divide(BigDecimal.valueOf(factor), numberOfDecimalPlaces, BigDecimal.ROUND_HALF_UP)
}

fun Int.toDecimal(): BigDecimal = this.toLong().toDecimal()
fun Long.toDecimal(): BigDecimal = BigDecimal.valueOf(this)
fun Double.toDecimal(): BigDecimal = BigDecimal.valueOf(this)

fun String.toDecimalOrNull(): BigDecimal?
{
    try
    {
        return BigDecimal(this)
    }
    catch (e: NumberFormatException)
    {
        return null
    }
}