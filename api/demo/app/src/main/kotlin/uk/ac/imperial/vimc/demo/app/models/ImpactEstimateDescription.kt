package uk.ac.imperial.vimc.demo.app.models

import java.time.Instant

data class ImpactEstimateDescription(val id: Int,
                                     val scenario: Scenario,
                                     private val modelName: String,
                                     private val modelVersion: String,
                                     val uploadedTimestamp: Instant) {
    val model
        get() = "$modelName: $modelVersion"
}