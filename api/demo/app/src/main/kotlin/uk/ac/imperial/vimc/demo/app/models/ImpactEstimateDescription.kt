package uk.ac.imperial.vimc.demo.app.models

import java.time.Instant

data class ImpactEstimateDescription(val id: Int,
                                     val scenario: Scenario,
                                     val modelVersion: String,
                                     val uploadedTimestamp: Instant)