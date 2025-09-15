package org.vaccineimpact.api.blackboxTests.helpers

import com.beust.klaxon.JsonObject
import com.beust.klaxon.json

fun Map<String, *>.toJsonObject(): JsonObject
{
    val pairs = entries.map { it.toPair() }.toTypedArray()
    return json {
        obj(*pairs)
    }
}