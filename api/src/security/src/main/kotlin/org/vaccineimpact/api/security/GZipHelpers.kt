package org.vaccineimpact.api.security

import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStreamReader
import java.util.*
import java.util.zip.GZIPInputStream
import java.util.zip.GZIPOutputStream

fun deflate(uncompressed: String): String
{
    val bytes = ByteArrayOutputStream().use { byteStream ->
        GZIPOutputStream(byteStream).use {
            it.write(uncompressed.toByteArray())
            it.flush()
        }
        byteStream.toByteArray()
    }
    return Base64.getEncoder().encodeToString(bytes)
}

fun inflate(compressed: String?): String?
{
    if (compressed == null)
    {
        return null
    }
    else
    {
        if (compressed.isEmpty()) {
            return ""
        }
        val bytes = Base64.getDecoder().decode(compressed)

        return if (isCompressed(bytes))
        {
            val inputStream = GZIPInputStream(ByteArrayInputStream(bytes))
            InputStreamReader(inputStream, "UTF-8")
                    .buffered()
                    .readLines()
                    .joinToString("\n")
        }
        else
        {
            compressed
        }
    }
}

private fun isCompressed(compressed: ByteArray) =
        compressed[0] == (GZIPInputStream.GZIP_MAGIC.toByte())
                && compressed[1] == (GZIPInputStream.GZIP_MAGIC shr 8).toByte()