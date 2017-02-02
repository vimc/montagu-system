package uk.ac.imperial.vimc.demo.app.models

import java.time.Instant

@Suppress("unused")
class ImpactEstimate(val id: Int,
                     val scenario: Scenario,
                     val modelVersion : String,
                     val uploadedTimestamp: Instant,
                     val outcomes: List<CountryOutcomes>) {
    val years = scenario.years
}