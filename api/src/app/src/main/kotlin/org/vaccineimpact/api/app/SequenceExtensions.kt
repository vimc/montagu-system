package org.vaccineimpact.api.app

// This passes through the original sequence without affecting it, and the
// sequence remains lazily evaluated, but as the elements "pass through"
// this function, they are checked to make sure the result of projection
// function is the same for every element.
//
// If they are not, the provided exception is thrown. Note that the
// exception will originate from whatever part of the program is currently
// asking for another element from the sequence, not from the caller of
// this function.
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