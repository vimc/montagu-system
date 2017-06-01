package org.vaccineimpact.api.app

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.HomeController
import org.vaccineimpact.api.app.controllers.MontaguControllers
import org.vaccineimpact.api.app.controllers.OneTimeLinkController
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.jooq.*
import org.vaccineimpact.api.app.repositories.makeRepositories
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.security.WebTokenHelper
import java.io.File
import java.net.BindException
import java.net.ConnectException
import java.net.ServerSocket
import java.net.Socket
import kotlin.system.exitProcess
import spark.Spark as spk

fun main(args: Array<String>)
{
    val api = MontaguApi()
    api.run(makeRepositories())
}

class MontaguApi
{
    private val urlBase = "/v1"
    private val tokenHelper = WebTokenHelper()

    private val logger = LoggerFactory.getLogger(MontaguApi::class.java)

    fun run(repositories: Repositories)
    {
        setupSSL()
        setupPort()
        spk.redirect.get("/", urlBase)
        spk.before("*", ::addTrailingSlashes)
        spk.options("*", { _, res ->
            res.header("Access-Control-Allow-Headers", "Authorization")
        })
        ErrorHandler.setup()

        val controllerContext = ControllerContext(repositories, tokenHelper)
        val standardControllers = MontaguControllers(controllerContext)
        val oneTimeLink = OneTimeLinkController(controllerContext, standardControllers)
        val endpoints = (standardControllers.all + oneTimeLink).flatMap {
            it.mapEndpoints(urlBase)
        }
        HomeController(endpoints, controllerContext).mapEndpoints(urlBase)
    }

    private fun setupSSL()
    {
        val path = Config["ssl.keystore.path"]
        val password = Config["ssl.keystore.password"]
        if (!File(path).exists())
        {
            logger.error("SSL keystore could not be found at $path")
            exitProcess(-1)
        }
        spark.Spark.secure(path, password, null, null)
    }

    private fun setupPort()
    {
        val port = Config.getInt("app.port")
        var attempts = 5
        spk.port(port)

        while (!isPortAvailable(port) && attempts > 0)
        {
            logger.info("Waiting for port $port to be available, $attempts attempts remaining")
            Thread.sleep(2000)
            attempts--
        }
        if (attempts == 0)
        {
            logger.error("Unable to bind to port $port - it is already in use.")
            exitProcess(-1)
        }
    }

    private fun isPortAvailable(port: Int): Boolean
    {
        try
        {
            ServerSocket(port).use {}
            return true
        }
        catch (e: BindException)
        {
            return false
        }
    }
}
