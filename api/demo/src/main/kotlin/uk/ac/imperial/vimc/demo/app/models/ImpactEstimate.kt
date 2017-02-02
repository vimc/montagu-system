package uk.ac.imperial.vimc.demo.app.models

import java.time.LocalDate

@Suppress("unused")
class ImpactEstimate(val id: Int,
                     val scenario: Scenario,
                     val modelVersion : String,
                     val dateUploaded: LocalDate,
                     val outcomes: List<CountryOutcomes>) {
    val years = scenario.years
}