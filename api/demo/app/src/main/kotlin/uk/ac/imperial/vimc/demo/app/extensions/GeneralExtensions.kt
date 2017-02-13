package uk.ac.imperial.vimc.demo.app.extensions

fun <T> T.getOther(a: T, b: T) = when (this)
{
    a -> b
    b -> a
    else -> throw Exception("The given object '$this' was neither '$a' not '$b'")
}