package org.vaccineimpact.api.serialization

fun <T> Sequence<T>.headAndTail(): Pair<T?, Sequence<T>>
{
    val iterator = this.iterator()
    val head = if (iterator.hasNext()) iterator.next() else null
    val tail = iterator.asSequence()
    return Pair(head, tail)
}