package org.vaccineimpact.api.app.extensions

fun <T> T.getOther(a: T, b: T) = when (this)
{
    a -> b
    b -> a
    else -> throw IllegalArgumentException("The given object '$this' was neither '$a' not '$b'")
}