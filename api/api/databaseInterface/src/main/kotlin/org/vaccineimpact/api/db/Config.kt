package org.vaccineimpact.api.db

import java.util.*

object Config
{
    private val properties = Properties().apply {
        load(getResource("config.properties").openStream())
    }

    operator fun get(key: String): String = properties[key] as String
    fun getInt(key: String) = get(key).toInt()
}