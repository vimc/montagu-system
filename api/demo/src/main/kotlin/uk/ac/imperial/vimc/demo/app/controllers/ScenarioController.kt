package uk.ac.imperial.vimc.demo.app.controllers

import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilter
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.models.StaticScenarios
import uk.ac.imperial.vimc.demo.app.viewmodels.ScenarioMetadata

class ScenarioController {
    fun getAllScenarios(req: Request, res: Response): List<ScenarioMetadata> {
        val scenarios = ScenarioFilter.apply(StaticScenarios.all, req)
        return scenarios.map(::ScenarioMetadata)
    }
    fun getScenario(req: Request, res: Response): Scenario {
        val id = req.params(":id")
        return StaticScenarios.all.single { it.id == id }
    }
}