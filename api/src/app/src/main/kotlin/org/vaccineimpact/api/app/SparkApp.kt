package org.vaccineimpact.api.app

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.HomeController
import org.vaccineimpact.api.app.controllers.MontaguControllers
import org.vaccineimpact.api.app.controllers.OneTimeLinkController
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.jooq.*
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Spark as spk

fun main(args: Array<String>)
{
    val api = MontaguApi()
    api.run(api.makeRepositories())
}

class MontaguApi
{
    private val urlBase = "/v1"
    private val tokenHelper = WebTokenHelper()

    fun makeRepositories(): Repositories
    {
        val simpleObjectsRepository = { JooqSimpleObjectsRepository() }
        val userRepository = { JooqUserRepository() }
        val tokenRepository = { JooqTokenRepository() }
        val scenarioRepository = { JooqScenarioRepository() }
        val touchstoneRepository = { JooqTouchstoneRepository(scenarioRepository) }
        val modellingGroupRepository = { JooqModellingGroupRepository(touchstoneRepository, scenarioRepository) }
        return Repositories(
                simpleObjectsRepository,
                userRepository,
                tokenRepository,
                touchstoneRepository,
                scenarioRepository,
                modellingGroupRepository
        )
    }

    private val logger = LoggerFactory.getLogger(MontaguApi::class.java)

    fun run(repositories: Repositories)
    {
        SSL.setup()
        spk.port(Config.getInt("app.port"))
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
}
