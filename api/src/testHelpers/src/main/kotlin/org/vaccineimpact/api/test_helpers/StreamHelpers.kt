package org.vaccineimpact.api.test_helpers

import java.io.ByteArrayOutputStream
import java.io.OutputStream
import java.nio.charset.Charset

fun serializeToStreamAndGetAsString(work: (OutputStream) -> Unit): String
{
    return ByteArrayOutputStream().use {
        work(it)
        String(it.toByteArray(), Charset.defaultCharset())
    }
}