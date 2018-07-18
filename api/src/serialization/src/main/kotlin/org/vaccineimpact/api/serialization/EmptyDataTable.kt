package org.vaccineimpact.api.serialization

import com.opencsv.CSVWriter
import org.vaccineimpact.api.models.helpers.ContentTypes
import java.io.OutputStream
import kotlin.reflect.KClass

class EmptyDataTable<T : Any>(val numRows: Int,
                              extraHeaders: Iterable<String>,
                              type: KClass<T>
): StreamSerializable<Any?>
{
    private val flexibleDataTable: FlexibleDataTable<T> = FlexibleDataTable(listOf<T>().asSequence(), extraHeaders, type)

    override val contentType: String = ContentTypes.csv
    override val data: Sequence<Any?> = arrayOfNulls<Any>(numRows).asSequence()

    override fun serialize(stream: OutputStream, serializer: Serializer)
    {
        val headers = flexibleDataTable.getHeaders(serializer)
        stream.writer().let { writer ->
            CSVWriter(writer).let { csv ->

                val headerArray = flexibleDataTable.prepareHeadersForCSV(headers)
                csv.writeNext(headerArray, false)

                for (i in 1..numRows)
                {
                    val asArray = arrayOfNulls<String>(headers.count())
                    csv.writeNext(asArray, false)
                }
            }
            // We want to flush this writer, but we don't want to close the underlying stream, as there
            // be more to write to it
            writer.flush()
        }
    }

    companion object
    {
        // Simple helper to get around JVM type erasure
        inline fun <reified R : Any> new(numRows: Int, flexibleHeaders: Iterable<String>)
                = EmptyDataTable(numRows, flexibleHeaders,  R::class)
    }
}