package uk.ac.imperial.vimc.demo.app

import uk.ac.imperial.vimc.demo.app.controllers.ModellingGroupController
import uk.ac.imperial.vimc.demo.app.controllers.ScenarioController
import uk.ac.imperial.vimc.demo.app.errors.ErrorHandler
import uk.ac.imperial.vimc.demo.app.repositories.jooq.JooqModellingGroupRepository
import uk.ac.imperial.vimc.demo.app.repositories.jooq.JooqScenarioRepository
import spark.Spark as spk

fun main(args: Array<String>)
{
    val scenarioController = ScenarioController({ JooqScenarioRepository() })
    val modellingGroupController = ModellingGroupController({ JooqModellingGroupRepository() })
    DemoApp().run(scenarioController, modellingGroupController)
}

class DemoApp
{
    private val urlBase = "/v1"
    private val jsonTransform = Serializer::toResult

    fun run(scenarios: ScenarioController, modellers: ModellingGroupController)
    {
        spk.port(8080)
        spk.redirect.get("/", urlBase)
        spk.before("*", ::addTrailingSlashes)
        ErrorHandler.setup()

        spk.get("$urlBase/", { req, res -> "root.json" }, ::fromFile)
        spk.get("$urlBase/scenarios/", scenarios::getAllScenarios, jsonTransform)
        spk.get("$urlBase/scenarios/:scenario-id/", scenarios::getScenario, jsonTransform)
        spk.get("$urlBase/scenarios/:scenario-id/countries/", scenarios::getCountriesInScenario, jsonTransform)
        spk.get("$urlBase/modellers/", modellers::getAllModellingGroups, jsonTransform)
        spk.get("$urlBase/modellers/", modellers::getAllModellingGroups, jsonTransform)
        spk.get("$urlBase/modellers/:group-code/", modellers::getModellingGroup, jsonTransform)
        spk.get("$urlBase/modellers/:group-code/models/", modellers::getModels, jsonTransform)
        spk.get("$urlBase/modellers/:group-code/responsibilities/", modellers::getResponsibilities, jsonTransform)
        spk.get("$urlBase/modellers/:group-code/estimates/", modellers::getAllEstimates, jsonTransform)
        spk.get("$urlBase/modellers/:group-code/estimates/:estimate-id/", modellers::getEstimate, jsonTransform)
        spk.post("$urlBase/modellers/:group-code/estimates/", modellers::createEstimate, jsonTransform)

        spk.after("*", { req, res -> addDefaultResponseHeaders(res) })
    }
}
