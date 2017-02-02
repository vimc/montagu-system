package uk.ac.imperial.vimc.demo.app.controllers

import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilter
import uk.ac.imperial.vimc.demo.app.models.Country
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.models.StaticScenarios
import uk.ac.imperial.vimc.demo.app.viewmodels.ViewScenarioMetadata

class ScenarioController {
    fun getAllScenarios(req: Request, res: Response): List<ViewScenarioMetadata> {
        val scenarios = ScenarioFilter.apply(StaticScenarios.all, req)
        return scenarios.map(::ViewScenarioMetadata)
    }

    fun getScenario(req: Request, res: Response): Scenario {
        return getScenario(req)
    }

    fun getCountriesInScenario(req: Request, res: Response): List<Country> {
        return getScenario(req).countries.toList()
    }

    private fun getScenario(req: Request): Scenario {
        val id = req.params(":scenario-id")
        return StaticScenarios.all.single { it.id == id }
    }
}