package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.ImpactEstimate
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup

@Suppress("Unused")
class ImpactEstimateAndGroup(group: ModellingGroup, estimate: ImpactEstimate) {
    val group = ModellingGroupMetadata(group)
    val estimate = ImpactEstimateMetadata(estimate)
    val data = estimate.outcomes
}