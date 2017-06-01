package org.vaccineimpact.api.app

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.db.Config
import spark.Spark
import java.io.File
import kotlin.system.exitProcess

object SSL
{
    fun setup()
    {
        val logger = LoggerFactory.getLogger(SSL::class.java)

        val path = Config["ssl.keystore.path"]
        val password = Config["ssl.keystore.password"]
        if (!File(path).exists())
        {
            logger.error("SSL keystore could not be found at $path")
            exitProcess(-1)
        }
        Spark.secure(path, password, null, null)
    }
}