package org.vaccineimpact.api.security

import org.vaccineimpact.api.models.Compressed
import org.vaccineimpact.api.models.markAsCompressed
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStreamReader
import java.util.*
import java.util.zip.GZIPInputStream
import java.util.zip.GZIPOutputStream

fun Compressed.inflated() = inflate(this.raw)
fun String.deflated() = deflate(this)

private fun deflate(uncompressed: String): Compressed
{
    val bytes = ByteArrayOutputStream().use { byteStream ->
        GZIPOutputStream(byteStream).use {
            it.write(uncompressed.toByteArray())
            it.flush()
        }
        byteStream.toByteArray()
    }
    return Base64
            .getUrlEncoder()
            .withoutPadding()
            .encodeToString(bytes)
            .markAsCompressed()
}

@JvmName("inflateNullable")
fun inflate(compressed: String?): String?
{
    return if (compressed == null)
    {
        null
    }
    else
    {
        inflate(compressed)
    }
}

fun inflate(compressed: String): String
{
    if (compressed.isEmpty())
    {
        return ""
    }

    val bytes = try
    {
        Base64.getUrlDecoder().decode(compressed)
    }
    catch (e: IllegalArgumentException)
    {
        null
    }

    return if (bytes != null && isCompressed(bytes))
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

@JvmName("inflateExplicitCompressed")
fun inflate(compressed: Compressed) = inflate(compressed.raw)
@JvmName("inflateNullableExplicitCompressed")
fun inflate(compressed: Compressed?) = inflate(compressed?.raw)

private fun isCompressed(compressed: ByteArray) =
        compressed[0] == (GZIPInputStream.GZIP_MAGIC.toByte())
                && compressed[1] == (GZIPInputStream.GZIP_MAGIC shr 8).toByte()