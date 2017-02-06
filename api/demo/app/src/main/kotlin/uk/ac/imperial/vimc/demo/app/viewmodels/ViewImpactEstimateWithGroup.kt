package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.ImpactEstimate
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup

@Suppress("Unused")
class ImpactEstimateDataAndGroup(group: ModellingGroup, estimate: ImpactEstimate) {
    val group = ViewModellingGroupMetadata(group)
    val estimate = ViewImpactEstimateMetadata(estimate)
    val outcomes = estimate.outcomes
}