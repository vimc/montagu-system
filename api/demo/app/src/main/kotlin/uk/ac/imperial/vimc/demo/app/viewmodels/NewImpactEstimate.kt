package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.*
import uk.ac.imperial.vimc.demo.app.repositories.Repository
import java.time.Instant

class NewImpactEstimate(val scenarioId: String?, val modelVersion: String?, val outcomes: List<NewCountryOutcomes>?) {
    class NewCountryOutcomes(val countryId: String?, val data: List<NewOutcome>?)
    class NewOutcome(val year: Year?, val numberOfDeaths: Int?)

    fun toEstimate(group: ModellingGroup, db: Repository): ImpactEstimate {
        val scenarioId = scenarioId ?: missingParameter("scenario_id")
        val scenario = db.scenarios.get(scenarioId)
        val modelVersion = modelVersion ?: missingParameter("model_version")
        val outcomes = outcomes ?: missingParameter("outcomes")

        val estimate = ImpactEstimate(
                id = ModellingGroup.newEstimateId(db),
                scenario = scenario,
                uploadedTimestamp = Instant.now(),
                modelVersion = modelVersion,
                outcomes = outcomes.map({ toCountryOutcomes(it, db) })
        )
        group.estimates.add(estimate)
        return estimate
    }

    private fun toCountryOutcomes(outcomes: NewCountryOutcomes, repository: Repository): CountryOutcomes {
        val countryId = outcomes.countryId ?: missingParameter("country_id")
        val country = repository.countries.get(countryId)
        val data = outcomes.data ?: missingParameter("data", "on 'outcomes' object with country '${outcomes.countryId}'")
        return CountryOutcomes(country, data.map { toOutcome(it, country) })
    }

    private fun toOutcome(outcome: NewOutcome, country: Country): Outcome {
        val year = outcome.year ?: missingParameter("year", "on 'outcomes' object within the data for country '$country'")
        val numberOfDeaths = outcome.numberOfDeaths ?: missingParameter("number_of_deaths", "on 'outcomes' object within the data for country '$country'")
        return Outcome(year, numberOfDeaths)
    }

    private fun <T> missingParameter(name: String, text: String = ""): T {
        throw IllegalArgumentException("Missing required parameter '$name' $text")
    }
}