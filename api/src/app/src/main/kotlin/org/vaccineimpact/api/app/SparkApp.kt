package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.controllers.TouchstoneController
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import spark.Spark as spk

fun main(args: Array<String>)
{
    val api = MontaguApi()
    api.run(api.makeRepositories())
}

class MontaguApi
{
    private val urlBase = "/v1"
    private val jsonTransform = Serializer::toResult

    fun makeRepositories(): Repositories
    {
        val touchstoneRepository = { JooqTouchstoneRepository() }
        val scenarioRepository = { JooqScenarioRepository() }
        val modellingGroupRepository = { JooqModellingGroupRepository(touchstoneRepository, scenarioRepository) }
        return Repositories(
                touchstoneRepository,
                scenarioRepository,
                modellingGroupRepository
        )
    }

    fun run(repositories: Repositories)
    {
        spk.port(8080)
        spk.redirect.get("/", urlBase)
        spk.before("*", ::addTrailingSlashes)
        ErrorHandler.setup()

        val controllers = listOf(
                TouchstoneController(repositories.touchstoneRepository),
                ModellingGroupController(repositories.modellingGroupRepository)
        )
        for (controller in controllers)
        {
            controller.mapEndpoints(urlBase)
        }

        spk.after("*", { req, res -> addDefaultResponseHeaders(res) })
    }
}
