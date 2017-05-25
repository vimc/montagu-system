package org.vaccineimpact.api.app

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.controllers.*
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.jooq.*
import org.vaccineimpact.api.app.serialization.Serializer
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
        val scenarioRepository = { JooqScenarioRepository() }
        val touchstoneRepository = { JooqTouchstoneRepository(scenarioRepository) }
        val modellingGroupRepository = { JooqModellingGroupRepository(touchstoneRepository, scenarioRepository) }
        return Repositories(
                simpleObjectsRepository,
                userRepository,
                touchstoneRepository,
                scenarioRepository,
                modellingGroupRepository
        )
    }

    private val logger = LoggerFactory.getLogger(MontaguApi::class.java)

    fun run(repositories: Repositories)
    {
        spk.port(8080)
        spk.redirect.get("/", urlBase)
        spk.before("*", ::addTrailingSlashes)
        spk.options("*", { _, res ->
            res.header("Access-Control-Allow-Headers", "Authorization")
        })
        spk.before("*", { req, _ -> logger.warn(req.headers("Accepts")) })
        ErrorHandler.setup()

        val controllers: Iterable<AbstractController> = listOf(
                AuthenticationController(tokenHelper),
                DiseaseController(repositories.simpleObjectsRepository),
                TouchstoneController(repositories.touchstoneRepository),
                ModellingGroupController(repositories.modellingGroupRepository)
        )
        val endpoints = controllers.flatMap { it.mapEndpoints(urlBase, tokenHelper) }
        HomeController(endpoints).mapEndpoints(urlBase, tokenHelper)
    }
}
