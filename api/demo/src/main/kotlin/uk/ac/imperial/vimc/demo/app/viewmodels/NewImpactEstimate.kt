package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.*
import java.time.LocalDate

class NewImpactEstimate(val scenarioId: String?, val modelVersion: String?, val outcomes: List<NewCountryOutcomes>?) {
    class NewCountryOutcomes(val countryId: String?, val data: List<NewOutcome>?)
    class NewOutcome(val year: Year?, val numberOfDeaths: Int?)

    fun toEstimate(group: ModellingGroup): ImpactEstimate {
        val scenarioId = scenarioId ?: missingParameter("scenario_id")
        val scenario = StaticScenarios.all.singleOrNull { it.id == scenarioId }
            ?: badId("scenario_id", scenarioId, "scenario")
        val modelVersion = modelVersion ?: missingParameter("model_version")
        val outcomes = outcomes ?: missingParameter("outcomes")

        val estimate = ImpactEstimate(
                id = StaticModellingGroups.newEstimateId(),
                scenario = scenario,
                dateUploaded = LocalDate.now(),
                modelVersion = modelVersion,
                outcomes = outcomes.map(this::toCountryOutcomes)
        )
        group.estimates.add(estimate)
        return estimate
    }

    private fun toCountryOutcomes(outcomes: NewCountryOutcomes): CountryOutcomes {
        val country = StaticCountries.all.singleOrNull { it.id == outcomes.countryId }
            ?: badId("country_id", outcomes.countryId, "country")
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
    private fun <T> badId(name: String, value: Any?, typeName: String): T {
        throw IllegalArgumentException("Supplied $name '$value' does not match any known $typeName")
    }
}