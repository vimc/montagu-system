package org.vaccineimpact.api.app

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.app_start.Router
import org.vaccineimpact.api.app.app_start.route_config.MontaguRouteConfig
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.HomeController
import org.vaccineimpact.api.app.controllers.OneTimeLinkController
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.serialization.MontaguSerializer
import java.io.File
import java.net.BindException
import java.net.ServerSocket
import kotlin.system.exitProcess
import spark.Spark as spk

fun main(args: Array<String>)
{
    waitForGoSignal()
    val api = MontaguApi()
    api.run(RepositoryFactory())
}

class MontaguApi
{
    private val urlBase = "/v1"
    private val tokenHelper = WebTokenHelper(KeyHelper.keyPair)

    private val logger = LoggerFactory.getLogger(MontaguApi::class.java)

    fun run(repositoryFactory: RepositoryFactory)
    {
        setupPort()
        spk.redirect.get("/", urlBase)
        spk.before("*", ::addTrailingSlashes)
        spk.before("*", { _, res ->
            res.header("Access-Control-Allow-Origin", "*")
        })
        spk.after("*", { req, res ->
            repositoryFactory.inTransaction { repos ->
                RequestLogger(repos.accessLogRepository).log(req, res)
            }
        })
        spk.options("*", { _, res ->
            res.header("Access-Control-Allow-Headers", "Authorization")
        })
        NotFoundHandler().setup()
        ErrorHandler.setup()

        // Old style controllers
        val controllerContext = ControllerContext(urlBase, repositoryFactory, tokenHelper)
        val oneTimeLink = OneTimeLinkController(controllerContext)
        val oldStyleEndpoints = listOf(oneTimeLink).flatMap {
            it.mapEndpoints()
        }

        // New style controllers
        val router = Router(MontaguRouteConfig, MontaguSerializer.instance, tokenHelper, repositoryFactory)
        val newStyleEndpoints = router.mapEndpoints(urlBase)

        val allEndpoints = (oldStyleEndpoints + newStyleEndpoints).sorted()
        HomeController(allEndpoints, controllerContext).mapEndpoints()

        if (!Config.authEnabled)
        {
            logger.warn("WARNING: AUTHENTICATION IS DISABLED")
        }
    }

    private fun setupPort()
    {
        val port = if (Config.authEnabled)
        {
            Config.getInt("app.port")
        }
        else
        {
            8888
        }
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