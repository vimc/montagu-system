package org.vaccineimpact.api.serialization

import kotlin.reflect.KClass

@Suppress("UNCHECKED_CAST")
class EmptyDataTable<T : Any>(numRows: Int,
                              extraHeaders: Iterable<String>,
                              type: KClass<T>
): FlexibleDataTable<T>(arrayOfNulls<Any>(numRows).asSequence() as Sequence<T>, extraHeaders, type)
{
    override fun allValuesAsArray(headers: Iterable<DataTableHeader<T>>, line: T?, serializer: Serializer): Array<String?>
    {
        return arrayOfNulls(headers.count())
    }

    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(numRows: Int, flexibleHeaders: Iterable<String>)
                = EmptyDataTable(numRows, flexibleHeaders,  R::class)
    }
}