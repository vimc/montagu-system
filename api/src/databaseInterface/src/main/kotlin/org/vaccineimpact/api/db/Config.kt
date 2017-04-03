package org.vaccineimpact.api.db

import java.util.*

object Config
{
    private val properties = Properties().apply {
        load(getResource("config.properties").openStream())
    }

    operator fun get(key: String): String
    {
        val x = properties[key]
        if (x != null)
        {
            return x as String
        }
        else
        {
            throw MissingConfigurationKey(key)
        }
    }

    fun getInt(key: String) = get(key).toInt()
}

class MissingConfigurationKey(val key: String): Exception("Missing configuration key '$key'")