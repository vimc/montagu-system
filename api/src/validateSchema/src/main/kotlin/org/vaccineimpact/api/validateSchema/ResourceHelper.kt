package org.vaccineimpact.api.validateSchema

import java.io.InputStream
import java.net.URL

object ResourceHelper
{
    private val loader = ResourceHelper::class.java.classLoader
    fun getResource(path: String): URL = loader.getResource(path)
    fun getResourceAsStream(path: String): InputStream = loader.getResourceAsStream(path)
}