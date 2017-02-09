package uk.ac.imperial.vimc.demo.app.models

import java.time.Instant

data class ImpactEstimate(var id: Int = 0,
                          val scenarioId: String,
                          val modelVersion : String,
                          val uploadedTimestamp: Instant,
                          val outcomes: List<CountryOutcomes>)