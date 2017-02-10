package uk.ac.imperial.vimc.demo.app.models

import uk.ac.imperial.vimc.demo.app.repositories.ScenarioRepository
import java.time.Instant

class NewImpactEstimate(
        val scenarioId: String?,
        val modelName: String?,
        val modelVersion: String?,
        val outcomes: List<NewCountryOutcomes>?) {
    class NewCountryOutcomes(val countryId: String?, val data: List<NewOutcome>?)
    class NewOutcome(val year: Year?, val numberOfDeaths: Int?)

    fun getScenario(db: ScenarioRepository): Scenario {
        val scenarioId = scenarioId ?: missingParameter("scenario_id")
        return db.scenarios.get(scenarioId)
    }
    fun getImpactEstimates(scenario: Scenario): ImpactEstimate {
        val modelName = modelName ?: missingParameter("model_name")
        val modelVersion = modelVersion ?: missingParameter("model_version")
        val outcomes = outcomes ?: missingParameter("outcomes")

        return ImpactEstimate(
                uploadedTimestamp = Instant.now(),
                scenarioId = scenario.id,
                modelName = modelName,
                modelVersion = modelVersion,
                outcomes = outcomes.map(this::toCountryOutcomes)
        )
    }

    private fun toCountryOutcomes(outcomes: NewCountryOutcomes): CountryOutcomes {
        val countryId = outcomes.countryId ?: missingParameter("country_id")
        val data = outcomes.data ?: missingParameter("data", "on 'outcomes' object with country '${outcomes.countryId}'")
        return CountryOutcomes(countryId, data.map { toOutcome(it, countryId) })
    }

    private fun toOutcome(outcome: NewOutcome, countryId: String): Outcome {
        val year = outcome.year ?: missingParameter("year", "on 'outcomes' object within the data for country '$countryId'")
        val numberOfDeaths = outcome.numberOfDeaths ?: missingParameter("number_of_deaths", "on 'outcomes' object within the data for country '$countryId'")
        return Outcome(year, numberOfDeaths)
    }

    private fun <T> missingParameter(name: String, text: String = ""): T {
        throw IllegalArgumentException("Missing required parameter '$name' $text")
    }
}