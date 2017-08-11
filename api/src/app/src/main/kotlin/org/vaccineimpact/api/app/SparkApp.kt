package org.vaccineimpact.api.app

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.HomeController
import org.vaccineimpact.api.app.controllers.MontaguControllers
import org.vaccineimpact.api.app.controllers.OneTimeLinkController
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.makeRepositories
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import java.io.File
import java.net.BindException
import java.net.ServerSocket
import kotlin.system.exitProcess
import spark.Spark as spk

fun main(args: Array<String>)
{
    waitForGoSignal()
    val api = MontaguApi()
    api.run(makeRepositories())
}

class MontaguApi
{
    private val urlBase = "/v1"
    private val tokenHelper = WebTokenHelper(KeyHelper.keyPair)

    private val logger = LoggerFactory.getLogger(MontaguApi::class.java)

    fun run(repositories: Repositories)
    {
        val requestLogger = RequestLogger(repositories.accessLogRepository)

        setupPort()
        spk.redirect.get("/", urlBase)
        spk.before("*", ::addTrailingSlashes)
        spk.before("*", { _, res ->
            res.header("Access-Control-Allow-Origin", "*")
        })
        spk.after("*", requestLogger::log)
        spk.options("*", { _, res ->
            res.header("Access-Control-Allow-Headers", "Authorization")
        })
        ErrorHandler.setup()

        val controllerContext = ControllerContext(urlBase, repositories, tokenHelper)
        val standardControllers = MontaguControllers(controllerContext)
        val oneTimeLink = OneTimeLinkController(controllerContext, standardControllers)
        val endpoints = (standardControllers.all + oneTimeLink).flatMap {
            it.mapEndpoints()
        }
        HomeController(endpoints, controllerContext).mapEndpoints()
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

// This is so that we can copy files into the Docker container after it exists
// but before the API starts running.
private fun waitForGoSignal()
{
    val path = File("/etc/montagu/api/go_signal")
    println("Waiting for signal file at $path.")
    println("(In development environments, run `sudo touch $path`)")

    while (!path.exists())
    {
        Thread.sleep(2000)
    }
    println("Go signal detected. Running API")
}