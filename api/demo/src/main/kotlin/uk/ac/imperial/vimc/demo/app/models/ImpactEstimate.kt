package uk.ac.imperial.vimc.demo.app.models

import uk.ac.imperial.vimc.demo.app.extensions.toSeed
import java.time.LocalDate
import java.util.*

@Suppress("unused")
class ImpactEstimate(val id: Int,
                     val scenario: Scenario,
                     val modelVersion : String,
                     val dateUploaded: LocalDate,
                     countries: Set<Country>,
                     val years: IntRange) {
    val outcomes = generateFakeOutcomes(countries)

    fun metadata() = ImpactEstimateMetadata(id, scenario, modelVersion, dateUploaded)

    private fun generateFakeOutcomes(countries: Set<Country>): List<CountryOutcomes> {
        val random = Random(scenario.id.toSeed())
        return countries.map { CountryOutcomes(it, random, years) }
    }
}

data class ImpactEstimateMetadata(val id: Int,
                                  val scenario: Scenario,
                                  val modelVersion : String,
                                  val dateUploaded: LocalDate)

class EstimateWithGroup(val group: ModellingGroupMetadata, val estimate: ImpactEstimate)