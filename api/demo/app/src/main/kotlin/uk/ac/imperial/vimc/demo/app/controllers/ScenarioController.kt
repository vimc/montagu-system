package uk.ac.imperial.vimc.demo.app.controllers

import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilter
import uk.ac.imperial.vimc.demo.app.models.Country
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.repositories.Repository
import uk.ac.imperial.vimc.demo.app.viewmodels.ViewScenario
import uk.ac.imperial.vimc.demo.app.viewmodels.ViewScenarioMetadata

class ScenarioController(private val db: Repository) {
    fun getAllScenarios(req: Request, res: Response): List<ViewScenarioMetadata> {
        val scenarios = ScenarioFilter.apply(db.scenarios.all(), req)
        return scenarios.map(::ViewScenarioMetadata)
    }

    fun getScenario(req: Request, res: Response): ViewScenario {
        return ViewScenario(getScenario(req))
    }

    fun getCountriesInScenario(req: Request, res: Response): List<Country> {
        return getScenario(req).countries.toList()
    }

    private fun getScenario(req: Request): Scenario {
        val id = req.params(":scenario-id")
        return db.scenarios.get(id)
    }
}