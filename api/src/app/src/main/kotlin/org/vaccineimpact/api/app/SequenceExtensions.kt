package org.vaccineimpact.api.app

fun <T, R> Sequence<T>.checkAllValuesAreEqual(
        project: (T) -> R,
        exceptionToThrow: Exception
): Sequence<T>
{
    var first: T? = null
    return this.onEach {
        first = first ?: it
        if (project(first!!) != project(it))
        {
            throw exceptionToThrow
        }
    }
}