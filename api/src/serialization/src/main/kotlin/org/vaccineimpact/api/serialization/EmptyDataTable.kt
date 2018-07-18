package org.vaccineimpact.api.serialization

import com.opencsv.CSVWriter
import org.vaccineimpact.api.models.helpers.ContentTypes
import java.io.OutputStream

class EmptyDataTable(private val headers: Array<String>, private val numRows: Int) : StreamSerializable<Any?> {

    override val contentType = ContentTypes.csv
    override val data = arrayOfNulls<Any>(headers.count()).asSequence()

    override fun serialize(stream: OutputStream, serializer: Serializer)
    {
        val serializedHeaders = headers.map { serializer.convertFieldName(it) }.toTypedArray()
        stream.writer().let { writer ->
            CSVWriter(writer).let { csv ->

                csv.writeNext(serializedHeaders, false)

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
}