package uk.ac.imperial.vimc.demo.app.models

import java.time.Instant

data class ImpactEstimateDescription(val id: Int,
                                     val scenario: Scenario,
                                     val model: ModelIdentifier,
                                     val uploadedTimestamp: Instant)