package uk.ac.imperial.vimc.demo.app.controllers

import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.Country
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.models.ScenarioAndCoverage
import uk.ac.imperial.vimc.demo.app.repositories.ScenarioRepository

class ScenarioController(private val db: ScenarioRepository) {
    fun getAllScenarios(req: Request, res: Response): List<Scenario> {
        return db.getScenarios(ScenarioFilterParameters.fromRequest(req)).toList()
    }

    fun getScenario(req: Request, res: Response): ScenarioAndCoverage {
        return db.getScenarioAndCoverage(req.scenarioId())
    }

    fun getCountriesInScenario(req: Request, res: Response): List<Country> {
        return db.getScenarioCountries(req.scenarioId())
    }

    private fun Request.scenarioId(): String = this.params(":scenario-id")
}