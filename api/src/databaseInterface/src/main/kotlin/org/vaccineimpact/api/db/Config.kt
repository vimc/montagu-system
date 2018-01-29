package org.vaccineimpact.api.db

import java.io.File
import java.util.*

object Config: ConfigWrapper
{
    private val properties = Properties().apply {
        load(getResource("config.properties").openStream())
        val global = File("/etc/montagu/api/config.properties")
        if (global.exists())
        {
            global.inputStream().use { load(it) }
        }
    }
    override val authEnabled by lazy {
        getBool("app.auth")
    }

    override operator fun get(key: String): String
    {
        val x = properties[key]
        if (x != null)
        {
            val value = x as String
            if (value.startsWith("\${"))
            {
                throw MissingConfiguration(key)
            }
            return value
        }
        else
        {
            throw MissingConfigurationKey(key)
        }
    }

    override fun getInt(key: String) = get(key).toInt()
    override fun getBool(key: String) = get(key).toBoolean()
}

interface ConfigWrapper {
    val authEnabled: Boolean
    operator fun get(key: String): String
    fun getInt(key: String): Int
    fun getBool(key: String): Boolean
}

class MissingConfiguration(key: String): Exception("Detected a value like \${foo} for key '$key' in the configuration. This probably means that the config template has not been processed. Try running ./gradlew :PROJECT:copy[Test]Config")
class MissingConfigurationKey(val key: String): Exception("Missing configuration key '$key'")