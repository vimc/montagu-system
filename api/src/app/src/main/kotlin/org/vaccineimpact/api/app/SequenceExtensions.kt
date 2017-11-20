package org.vaccineimpact.api.app

fun <T, R> Sequence<T>.checkAllValuesAreEqual(
        project: (T) -> R
): Sequence<T>?
{
    return try
    {
        var first: T? = null
        this.onEach {
            first = first ?: it
            if (project(first!!) != project(it))
            {
                throw NotAllValuesEqualException()
            }
        }
    }
    catch (e: NotAllValuesEqualException)
    {
        null
    }
}

private class NotAllValuesEqualException : Exception()