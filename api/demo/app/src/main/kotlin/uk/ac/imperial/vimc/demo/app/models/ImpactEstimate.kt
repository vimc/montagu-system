package uk.ac.imperial.vimc.demo.app.models

import java.time.Instant

data class ImpactEstimate(var id: Int = 0,
                          val scenarioId: String,
                          val model: ModelIdentifier,
                          val uploadedTimestamp: Instant,
                          val outcomes: List<CountryOutcomes>)
{
    fun toOutcomeLines(): Iterable<OutcomeLine> = outcomes.flatMap { it.toLines() }
}