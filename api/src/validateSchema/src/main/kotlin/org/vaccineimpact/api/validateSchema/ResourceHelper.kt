package org.vaccineimpact.api.validateSchema

import java.io.InputStream
import java.net.URL
import kotlin.streams.toList

object ResourceHelper
{
    private val loader = ResourceHelper::class.java.classLoader
    fun getResource(path: String): URL = loader.getResource(path)
    fun getResourceAsStream(path: String): InputStream = loader.getResourceAsStream(path)
    fun getResourcesInFolder(path: String, matching: Regex? = null): List<String>
    {
        var files = loader.getResourceAsStream(path)
                .bufferedReader().lines().toList()

        if (matching != null)
        {
            files = files.filter { matching.containsMatchIn(it) }
        }
        return files.map {
            path + it
        }
    }
}