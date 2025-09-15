package uk.ac.imperial.vimc.demo.app.models

import uk.ac.imperial.vimc.demo.app.errors.MissingRequiredParameterError
import java.time.Instant

class NewImpactEstimate(
        val scenarioId: String?,
        val modelName: String?,
        val modelVersion: String?,
        val outcomes: List<NewCountryOutcomes>?)
{
    class NewCountryOutcomes(val countryId: String?, val data: List<NewOutcome>?)
    class NewOutcome(
            val year: Year?,
            val deaths: Double?,
            val cases: Double?,
            val dalys: Double?,
            val fvps: Double?,
            val deathsAverted: Double?
    )

    fun getImpactEstimates(): ImpactEstimate
    {
        val scenarioId = scenarioId ?: missingParameter("scenario_id")
        val modelName = modelName ?: missingParameter("model_name")
        val modelVersion = modelVersion ?: missingParameter("model_version")
        val outcomes = outcomes ?: missingParameter("outcomes")

        return ImpactEstimate(
                uploadedTimestamp = Instant.now(),
                scenarioId = scenarioId,
                model = ModelIdentifier(modelName, modelVersion),
                outcomes = outcomes.withIndex().map(this::toCountryOutcomes)
        )
    }

    private fun toCountryOutcomes(outcomes: IndexedValue<NewCountryOutcomes>): CountryOutcomes
    {
        val countryId = outcomes.value.countryId ?: missingParameter("country_id", "outcomes[${outcomes.index}]")
        val data = outcomes.value.data ?: missingParameter("data", "outcomes[$countryId]")
        return CountryOutcomes(countryId, data.map { toOutcome(it, countryId) })
    }

    private fun toOutcome(outcome: NewOutcome, countryId: String): Outcome
    {
        val year = outcome.year ?: missingParameter("year", "on 'outcomes' object within the data for country '$countryId'")
        val map = mapOf(
                Outcome.Keys.deaths to outcome.deaths,
                Outcome.Keys.cases to outcome.cases,
                Outcome.Keys.dalys to outcome.dalys,
                Outcome.Keys.fvps to outcome.fvps,
                Outcome.Keys.deathsAverted to outcome.deathsAverted
        )
        if (map.values.all { it == null })
        {
            val options = Outcome.Keys.all.joinToString(", ")
            throw MissingRequiredParameterError("Expected one of [$options] in outcomes.data[$countryId]")
        }
        return Outcome(year, map)
    }

    private fun <T> missingParameter(name: String, context: String? = null): T
    {
        throw MissingRequiredParameterError(name, context)
    }
}